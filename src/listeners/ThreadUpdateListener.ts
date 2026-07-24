import { PixelListener } from "@structures/PixelListener";
import { config } from "@config";
import { ideas } from "@database/ideas";
import { type AnyThreadChannel } from "discord.js";

export class ThreadUpdateListener extends PixelListener<"threadUpdate"> {
    constructor() {
        super("ThreadUpdateListener", "threadUpdate");
    }

    run(oldThread: AnyThreadChannel, newThread: AnyThreadChannel) {
        if (newThread.parentId !== config.ideasChannel) return;
        if (oldThread.name === newThread.name) return;

        // Keep the index title in sync so renamed ideas still match duplicates.
        ideas.add({ id: newThread.id, title: newThread.name });
    }
}
