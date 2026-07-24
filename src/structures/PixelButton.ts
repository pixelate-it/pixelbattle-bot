import type { ButtonInteraction } from "discord.js";
import type { PixelClient } from "@structures/PixelClient";

export type PixelButtonInteraction = ButtonInteraction & {
    client: PixelClient;
};

/**
 * Base class for button handlers.
 *
 * The `id` is matched against the first `:`-separated segment of a component's
 * customId, so a single handler can carry a parameter — e.g. a button with id
 * `idea-status` handles `idea-status:planned`, `idea-status:rejected`, etc.
 */
export abstract class PixelButton {
    constructor(public readonly id: string) {}

    public abstract run(
        interaction: PixelButtonInteraction,
    ): Promise<void> | void;
}
