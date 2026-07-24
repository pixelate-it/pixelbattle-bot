import { config } from "@config";
import { ideas } from "@database/ideas";
import { ChannelType, type ForumChannel } from "discord.js";
import type { PixelClient } from "@structures/PixelClient";

/** Safety cap on archived-thread pagination during the one-time backfill. */
const MAX_BACKFILL_PAGES = 25;

/** Force all forum tags to `moderated` so only staff/the bot can apply them. */
async function lockTags(channel: ForumChannel) {
    if (!channel.availableTags.some((tag) => !tag.moderated)) return;

    try {
        await channel.setAvailableTags(
            channel.availableTags.map((tag) => ({ ...tag, moderated: true })),
        );
        console.log("* [IDEAS] Locked forum tags (moderated)");
    } catch (error) {
        console.error(
            "* [IDEAS] Could not lock tags (needs Manage Channels):",
            error,
        );
    }
}

/** Import every archived idea once, paginating from newest to oldest. */
async function backfillArchived(channel: ForumChannel) {
    let before: Date | undefined;

    for (let page = 0; page < MAX_BACKFILL_PAGES; page++) {
        const fetched = await channel.threads.fetchArchived({
            before,
            limit: 100,
        });
        for (const thread of fetched.threads.values()) {
            ideas.add({ id: thread.id, title: thread.name });
        }

        const oldest = fetched.threads.last();
        if (!fetched.hasMore || !oldest?.archivedAt) break;
        before = oldest.archivedAt;
    }
}

/**
 * Prepares the ideas forum on startup: locks its tags and keeps the persistent
 * idea index in sync. Active threads are reconciled every boot (cheap, 1 call);
 * the full archived backfill runs only once, when the index is still empty.
 */
export async function setupIdeasForum(client: PixelClient) {
    const channel = await client.channels
        .fetch(config.ideasChannel)
        .catch(() => null);
    if (channel?.type !== ChannelType.GuildForum) return;

    await lockTags(channel);

    const firstRun = ideas.count() === 0;

    const active = await channel.threads.fetchActive();
    for (const thread of active.threads.values()) {
        ideas.add({ id: thread.id, title: thread.name });
    }

    if (firstRun) await backfillArchived(channel);

    console.log(`* [IDEAS] Index ready (${ideas.count()} ideas)`);
}
