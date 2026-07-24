import {
    PixelButton,
    type PixelButtonInteraction,
} from "@structures/PixelButton";
import { IdeaButtons } from "@helpers/ideaMessage";
import { MessageFlags, ThreadChannel } from "discord.js";

export class IdeaCancelButton extends PixelButton {
    constructor() {
        super(IdeaButtons.cancel);
    }

    async run(interaction: PixelButtonInteraction) {
        const thread = interaction.channel;
        if (!(thread instanceof ThreadChannel)) return;

        if (interaction.user.id !== thread.ownerId) {
            await interaction.reply({
                content: "Отменить идею может только её автор.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        await interaction.reply({
            content: "Идея отменяется…",
            flags: MessageFlags.Ephemeral,
        });
        await thread.delete("Idea cancelled by author");
    }
}
