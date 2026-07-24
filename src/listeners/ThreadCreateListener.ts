import { PixelListener } from "@structures/PixelListener";
import { config } from "@config";
import { buildIdeaRows, IDEA_NOTICE, VOTE_EMOJI } from "@helpers/ideaMessage";
import { ideas } from "@database/ideas";
import { type AnyThreadChannel } from "discord.js";

/** Minimum Dice score for two idea titles to be treated as possible duplicates. */
const DUPLICATE_THRESHOLD = 0.6;

/** How long the author "Отменить / Оставить" buttons stay before auto-removal. */
const NOTICE_TIMEOUT = 120_000;

export class ThreadCreateListener extends PixelListener<"threadCreate"> {
    constructor() {
        super("ThreadCreateListener", "threadCreate");
    }

    async run(thread: AnyThreadChannel, newlyCreated: boolean) {
        if (!newlyCreated || thread.parentId !== config.ideasChannel) return;

        // Voting is a ⭐ reaction on the idea itself (the post's starter message).
        // Discord tracks who voted and the tally, so no local storage is needed.
        const starter = await thread.fetchStarterMessage().catch(() => null);
        await starter
            ?.react(VOTE_EMOJI)
            .catch((error) =>
                console.error("* [IDEAS] Failed to add reaction:", error),
            );

        // Duplicate detection reads from the persistent index (no Discord fetch).
        const duplicates = ideas.findSimilar(
            thread.name,
            thread.id,
            DUPLICATE_THRESHOLD,
        );
        ideas.add({ id: thread.id, title: thread.name });

        const content =
            duplicates.length > 0
                ? `${IDEA_NOTICE}\n\n**Возможные дубликаты:**\n${duplicates
                      .map((idea) => `- <#${idea.id}>`)
                      .join("\n")}`
                : IDEA_NOTICE;

        const message = await thread
            .send({ content, components: buildIdeaRows() })
            .catch((error) =>
                console.error("* [IDEAS] Failed to post notice:", error),
            );
        if (!message) return;

        // Retract the author notice buttons after a delay; the status row stays.
        // Silently ignored if the post was cancelled or the notice dismissed.
        setTimeout(() => {
            message
                .edit({ components: buildIdeaRows({ notice: false }) })
                .catch(() => {});
        }, NOTICE_TIMEOUT);
    }
}
