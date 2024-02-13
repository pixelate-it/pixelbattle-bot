const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

class AntiNewAccountService {
    constructor(client) {
        this.client = client;
        this.channel = client.channels.cache.get(client.config.notificationChannel)
    }

    async sendNotification(member) {
        return this.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Оповещение о новом аккаунте')
                    .setFooter({ text: 'Здесь появится ник модератора, предпринявшего действие' })
                    .setThumbnail(member.user.avatarURL())
                    .setFields([
                        {
                            name: '🍎 Информация',
                            value:
                                `> ID: \`${member.id}\`\n` +
                                `> Тег: \`${member.user.tag}\`\n` +
                                `> Ник: \`${member.nickname || 'отсутсвует'}\`\n` +
                                `> Дата регистрации: <t:${Math.ceil(member.user.createdTimestamp / 1000)}>\n`
                        }
                    ])
                    .setColor(0x5865F2)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder()
                            .setLabel('Забанить')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('⚠️')
                            .setCustomId(`ban_acc_${(await this.client.database.collection('users').findOne({ userID: member.id }))._id}`)
                    ])
            ]
        });
    }
}

module.exports = AntiNewAccountService;