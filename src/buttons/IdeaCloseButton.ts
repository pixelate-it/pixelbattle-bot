import {
    PixelButton,
    type PixelButtonInteraction,
} from "@structures/PixelButton";
import { IdeaButtons } from "@helpers/ideaMessage";
import { getModerator } from "@helpers/moderation";
import { MessageFlags, ThreadChannel } from "discord.js";

export class IdeaCloseButton extends PixelButton {
    constructor() {
        super(IdeaButtons.close);
    }

    async run(interaction: PixelButtonInteraction) {
        const thread = interaction.channel;
        if (!(thread instanceof ThreadChannel)) return;

        const member = await getModerator(interaction);
        if (!member) {
            await interaction.reply({
                content: "Закрывать идеи могут только модераторы.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        // Keep the post for the record but stop activity: lock, then archive.
        await interaction.reply({
            content: `Закрыто как дубликат (${member}).`,
        });
        await thread.setLocked(true, "Duplicate idea").catch(() => {});
        await thread.setArchived(true, "Duplicate idea").catch(() => {});
    }
}
