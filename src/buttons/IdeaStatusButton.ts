import {
    PixelButton,
    type PixelButtonInteraction,
} from "@structures/PixelButton";
import { IdeaButtons, IdeaStatusTags } from "@helpers/ideaMessage";
import { getModerator } from "@helpers/moderation";
import { ChannelType, MessageFlags, ThreadChannel } from "discord.js";

export class IdeaStatusButton extends PixelButton {
    constructor() {
        super(IdeaButtons.status);
    }

    async run(interaction: PixelButtonInteraction) {
        const key = interaction.customId.split(":")[1] ?? "";
        const tagName = IdeaStatusTags[key];
        if (!tagName || !interaction.guild) return;

        const thread = interaction.channel;
        if (!(thread instanceof ThreadChannel)) return;
        const parent = thread.parent;
        if (parent?.type !== ChannelType.GuildForum) return;

        const member = await getModerator(interaction);
        if (!member) {
            await interaction.reply({
                content: "Менять статус идеи могут только модераторы.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const target = parent.availableTags.find((tag) => tag.name === tagName);
        if (!target) {
            await interaction.reply({
                content: `Не найден тег форума «${tagName}». Создайте теги: ${Object.values(
                    IdeaStatusTags,
                ).join(", ")}.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        // Replace any existing status tag, preserve unrelated tags (max 5).
        const statusTagIds = parent.availableTags
            .filter((tag) => Object.values(IdeaStatusTags).includes(tag.name))
            .map((tag) => tag.id);
        const applied = [
            ...thread.appliedTags.filter((id) => !statusTagIds.includes(id)),
            target.id,
        ].slice(0, 5);

        await thread.setAppliedTags(applied);
        await interaction.reply({
            content: `Статус идеи: **${tagName}** (${member}).`,
        });
    }
}
