const PixelListener = require('../../structures/PixelListener');
const fetch = require("node-fetch");
const { EmbedBuilder, codeBlock } = require('discord.js');
const { ObjectId } = require('mongodb');

class InteractionCreateListener extends PixelListener {
    constructor() {
        super('InteractionCreateListener', { event: 'interactionCreate' });
    }

    async run(client, interaction) {
        if(!interaction.isButton()) return;
        if(!interaction.customId.startsWith('ban_acc_')) return;
        if(!client.permissions.moderator.has(interaction.user.id))
            return interaction.reply({
                content: 'У вас слишком низкий уровень прав для совершения данного действия!',
                ephemeral: true
            });
        if(interaction.message.embeds[0].fields.length > 1)
            return interaction.reply({
                content: 'С данным игроком уже совершено действие, вы не можете совершить его снова',
                ephemeral: true
            });

        await interaction.deferReply({ ephemeral: true });

        const _id = new ObjectId(interaction.customId.slice(8));
        const user = await client.database.collection('users').findOne({ _id });

        if(!user)
            return interaction.editReply('Игрок отсутствует в базе данных PixelBattle').catch(() => {});
        if(user.banned)
            return interaction.editReply('Игрок уже забанен').catch(() => {});

        const ban_data = {
            timeout: Date.now() + 172800000000,
            reason: '[AUTO] Аккаунт подозрителен, поскольку зарегестрирован недавно'
        };

        const response = await fetch(`${client.config.api_domain}/users/${user.userID}/ban`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + (await client.database.collection('users').findOne(
                    { userID: interaction.user.id },
                    { projection: { _id: 0, token: 1 } }
                ))?.token
            },
            body: JSON.stringify(ban_data)
        }).then(res => res?.json());
        if(response?.error ?? !response)
            return interaction.editReply('Попытка бана прошла неудачно\n' + response ? codeBlock('json', JSON.stringify(response)) : '');

        await client.database.collection('users').updateOne(
            { _id },
            {
                $set: {
                    banned: {
                        moderatorID: interaction.user.id,
                        ...ban_data
                    }
                }
            }
        );

        interaction.message.edit({
            embeds: [
                new EmbedBuilder(interaction.message.embeds[0])
                    .setTimestamp()
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL() })
                    .addFields([
                        {
                            name: '🛠️ Предпринятые действия',
                            value:
                                `> Игрок был заблокирован (MOD: \`${interaction.user.id}\`)`
                        }
                    ])
            ]
        }).catch(() => {});

        return interaction.editReply('Игрок был успешно заблокирован! Вы можете закрыть это сообщение.')
            .catch(() => {});
    }
}

module.exports = InteractionCreateListener;