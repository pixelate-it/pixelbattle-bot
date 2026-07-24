import { PixelListener } from "@structures/PixelListener";
import { config } from "@config";
import { ideas } from "@database/ideas";
import { type AnyThreadChannel } from "discord.js";

export class ThreadDeleteListener extends PixelListener<"threadDelete"> {
    constructor() {
        super("ThreadDeleteListener", "threadDelete");
    }

    run(thread: AnyThreadChannel) {
        if (thread.parentId !== config.ideasChannel) return;

        // Drop the idea from the index so deleted/cancelled posts stop
        // showing up as duplicate matches.
        ideas.remove(thread.id);
    }
}
