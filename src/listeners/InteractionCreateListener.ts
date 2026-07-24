import { PixelListener } from "@structures/PixelListener";
import type { PixelButtonInteraction } from "@structures/PixelButton";
import type { PixelClient } from "@structures/PixelClient";
import type { Interaction } from "discord.js";

export class InteractionCreateListener extends PixelListener<"interactionCreate"> {
    constructor() {
        super("InteractionCreateListener", "interactionCreate");
    }

    async run(interaction: Interaction) {
        if (!interaction.isButton()) return;

        const client = interaction.client as PixelClient;
        const id = interaction.customId.split(":")[0];
        const button = client.buttons.get(id);
        if (!button) return;

        try {
            await button.run(interaction as PixelButtonInteraction);
        } catch (error) {
            console.error(`* [BUTTON] "${id}" failed:`, error);
        }
    }
}
