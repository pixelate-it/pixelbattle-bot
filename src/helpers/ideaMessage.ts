import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const IDEA_NOTICE =
    "Если эта идея уже была создана, отмените её создание.";

/** Voting is a single ⭐ reaction — Discord stores the voters and the tally. */
export const VOTE_EMOJI = "⭐";

/** customId prefixes routed by InteractionCreateListener. */
export const IdeaButtons = {
    cancel: "idea-cancel",
    keep: "idea-keep",
    status: "idea-status",
    close: "idea-close",
} as const;

/** Status keys → forum tag names to resolve on the parent channel. */
export const IdeaStatusTags: Record<string, string> = {
    planned: "Запланировано",
    implemented: "Реализовано",
    rejected: "Отклонено",
};

interface IdeaRowsOptions {
    /** Include the author "Отменить / Оставить" notice row. */
    notice?: boolean;
}

/** Builds the button rows attached to an idea post. */
export function buildIdeaRows({
    notice = true,
}: IdeaRowsOptions = {}): ActionRowBuilder<ButtonBuilder>[] {
    const rows: ActionRowBuilder<ButtonBuilder>[] = [];

    if (notice) {
        rows.push(
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(IdeaButtons.cancel)
                    .setLabel("Отменить")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(IdeaButtons.keep)
                    .setLabel("Оставить")
                    .setStyle(ButtonStyle.Secondary),
            ),
        );
    }

    rows.push(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId(`${IdeaButtons.status}:planned`)
                .setLabel("Запланировано")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`${IdeaButtons.status}:implemented`)
                .setLabel("Реализовано")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`${IdeaButtons.status}:rejected`)
                .setLabel("Отклонено")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(IdeaButtons.close)
                .setLabel("Закрыть как дубликат")
                .setStyle(ButtonStyle.Danger),
        ),
    );

    return rows;
}
