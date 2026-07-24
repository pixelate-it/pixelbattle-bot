import { config } from "@config";
import {
    PermissionFlagsBits,
    type ButtonInteraction,
    type GuildMember,
} from "discord.js";

/**
 * Returns the interacting member if they may moderate ideas (a configured mod
 * role, or the Manage Threads permission), otherwise `null`.
 */
export async function getModerator(
    interaction: ButtonInteraction,
): Promise<GuildMember | null> {
    if (!interaction.guild) return null;

    const member = await interaction.guild.members
        .fetch(interaction.user.id)
        .catch(() => null);
    if (!member) return null;

    const allowed =
        member.roles.cache.hasAny(...config.modRoles) ||
        member.permissions.has(PermissionFlagsBits.ManageThreads);
    return allowed ? member : null;
}
