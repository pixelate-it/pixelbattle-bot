import {
    PixelButton,
    type PixelButtonInteraction,
} from "@structures/PixelButton";
import { buildIdeaRows, IdeaButtons } from "@helpers/ideaMessage";
import { MessageFlags, ThreadChannel } from "discord.js";

export class IdeaKeepButton extends PixelButton {
    constructor() {
        super(IdeaButtons.keep);
    }

    async run(interaction: PixelButtonInteraction) {
        const thread = interaction.channel;
        if (
            thread instanceof ThreadChannel &&
            interaction.user.id !== thread.ownerId
        ) {
            await interaction.reply({
                content: "Скрыть уведомление может только автор идеи.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        // Drop the notice row, keep the status row.
        await interaction.update({
            components: buildIdeaRows({ notice: false }),
        });
    }
}
