# AGENTS.md

This file provides guidance to coding agents (Claude Code, etc.) when working with code in this repository. `CLAUDE.md` is a symlink to this file.

## Overview

Discord bot for a PixelBattle game. It logs in to Discord, polls the game backend's `/game` endpoint to show the online player count as its "Watching" presence, and moderates the ideas **forum** (posts a notice + action buttons on each new idea post). Built on a small hand-rolled listener/button framework over `discord.js`.

## Commands

Package manager is **yarn** (`yarn.lock` is committed; the Nix flake and Dockerfile both use yarn).

- `yarn dev` — run in watch mode via `tsx watch src/index.ts`
- `yarn build` — type-check (`tsc`) then bundle with `tsup` into `dist/` (minified ESM)
- `yarn start` — run the built output (`node dist/index.js`)

There is no test runner or lint script configured. `prettier` is the only formatting tool (config in `.prettierrc`: 4-space indent, double quotes, semicolons, all trailing commas). Run `yarn prettier --write "src/**/*.ts"` after edits.

`nix develop` provides a dev shell with `nodejs_26` + `yarn`.

## Configuration

Runtime config is read from environment variables via `dotenv` in `src/config.ts`:

- `TOKEN` — Discord bot token
- `BACKEND_URL` — base URL of the PixelBattle backend API (fetch target for `/game`)
- `DB_PATH` — SQLite file for the idea index (defaults to `./ideas.db`)
- `IDEAS_CHANNEL` — forum channel ID whose new posts trigger the ideas flow (has a default)
- `MOD_ROLES` — comma-separated role IDs allowed to set idea status (has a default)

Note: `README.md` documents an older, larger bot and lists env vars that no longer exist — trust `src/config.ts`.

## Architecture

Event-listener + button framework over `discord.js`, using TypeScript path aliases (`@config`, `@helpers`, `@helpers/*`, `@database/*`, `@listeners`, `@buttons`, `@structures/*`, defined in `tsconfig.json`).

- **`PixelClient`** (`src/structures/PixelClient.ts`) — extends `discord.js` `Client`. Its `run()` calls `loadListeners` + `loadButtons` then logs in. Holds `events` and `buttons` Collections.
- **`PixelListener`** (`src/structures/PixelListener.ts`) — abstract base for event handlers. A subclass passes `(name, event, once)` to `super()` and implements `run()`. The `FixClient` mapped type rewrites any `Client` argument in the event signature to `PixelClient`.
- **`PixelButton`** (`src/structures/PixelButton.ts`) — abstract base for button handlers. `id` is matched against the first `:`-separated segment of a component's `customId`, so one handler can carry a param (e.g. id `idea-status` handles `idea-status:planned` / `idea-status:rejected`).
- **Registries** — `src/listeners/index.ts` and `src/buttons/index.ts` are manual arrays. `loadListeners` (`src/helpers/loadListeners.ts`) registers each listener via `client.on`/`client.once`; `loadButtons` fills the `buttons` Collection keyed by `id`. **To add a listener or button:** create the subclass and add an instance to the matching registry array.
- **`InteractionCreateListener`** — routes button clicks: `client.buttons.get(customId.split(":")[0])?.run(interaction)`.

Entry point `src/index.ts` constructs `PixelClient` with the `Guilds` intent (required for `threadCreate`) and calls `run()`.

TypeScript runs in bundler mode (`noEmit`, `allowImportingTsExtensions`, `verbatimModuleSyntax`); emission is done by `tsup` (single ESM bundle).

## Ideas forum system

- **`ThreadCreateListener`** — on a new post in `config.ideasChannel`: adds the vote reactions to the idea's **starter message** (`fetchStarterMessage`), runs duplicate detection against the **persistent index** (`ideas.findSimilar`, no Discord fetch), inserts the new idea, then posts the notice + button rows built by `src/helpers/ideaMessage.ts` (`buildIdeaRows`). Duplicates are listed as `<#threadId>` **mentions** (not echoed titles), so the links always show each post's live name. The author notice row is auto-removed after `NOTICE_TIMEOUT` (120s), leaving only the status row.
- **`ThreadUpdateListener`** — on a rename, updates the stored title so renamed ideas still match duplicates.
- **`ThreadDeleteListener`** — removes a deleted/cancelled post from the index so it stops matching as a duplicate.
- **Buttons** (`src/buttons/`): `IdeaCancelButton` (author deletes the post), `IdeaKeepButton` (author dismisses the notice row early), `IdeaStatusButton` (mod-gated: sets a forum tag), `IdeaCloseButton` (mod-gated: locks + archives a post — used to close an abandoned duplicate the author never cancelled). Both mod buttons live in the persistent status row and share the `getModerator` check (`src/helpers/moderation.ts`, a configured mod role or Manage Threads).
- **Voting** is a single native ⭐ **reaction** (`VOTE_EMOJI`), placed on the idea's starter message. Discord stores the voters and the tally per-user — no local state, survives restarts (a single emoji is inherently one-per-user, so no reaction listener is needed).
- **Status tags:** `IdeaStatusButton` resolves a forum tag **by name** (`Запланировано` / `Реализовано` / `Отклонено`, see `IdeaStatusTags` in `ideaMessage.ts`) from the parent forum's `availableTags` — those tags must exist on the forum channel for status changes to apply.

### Database & startup (`src/database/ideas.ts`, `src/helpers/ideasSetup.ts`)

- **Idea index** — a persistent SQLite store via Node's built-in `node:sqlite` (`DatabaseSync`). It's loaded with `createRequire` + a computed specifier (`src/database/ideas.ts`) because esbuild otherwise strips the `node:` prefix and emits a broken `from "sqlite"` in the bundle — **don't convert it to a static `import`**. Single table `ideas(id, title)`. Duplicate detection loads rows and compares with the JS **Sørensen–Dice** similarity (`src/helpers/similarity.ts`, char bigrams).
- **`setupIdeasForum`** (run from `ReadyListener`) — on boot: forces all forum tags to `moderated: true` (so only staff/the bot can apply tags; needs **Manage Channels**), reconciles `fetchActive()` into the index every start (cheap), and does a one-time full **archived backfill** (paginated, capped at `MAX_BACKFILL_PAGES`) only when the index is empty — this imports ideas that predate the bot.
- The DB file (`DB_PATH`, default `./ideas.db`) is gitignored; persist it across deploys (e.g. a Docker volume) or the archived backfill re-runs on next empty start.
