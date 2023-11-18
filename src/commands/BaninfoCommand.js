const PixelCommand = require('../structures/PixelCommand');
const BansManager = require('../managers/BansManager');
const { EmbedBuilder } = require('discord.js');

class BaninfoCommand extends PixelCommand {
    constructor() {
        super('baninfo', {
            cooldown: 5,
            aliases: []
        });
    }

    async run(message, args) {
        if(args.length = 0) 
            return message.reply({ content: 'Укажите ID или упомяните игрока, для просмотра его бана' })
        const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || await message.client.users.fetch(args[0]).catch(() => {});
        if(!user) 
            return message.reply({ content: 'Указанный вами игрок не был найден' });

        const msg = await message.reply({ content: 'Поиск данных об игроке...' });

        const manager = new BansManager(message.client);
        const ban = await manager.find({ userID: user.id });
        if(!ban) 
            return msg.edit({ content: 'Указанный вами игрок не находится в бане' });
        const moderator = message.client.users.cache.get(args[0]) || await message.client.users.fetch(ban.moderatorID).catch(() => {});

        return msg.edit({
            content: null,
            embeds: [
                new EmbedBuilder()
                .setTitle(`:information_source: Информация о ${user.id == message.author.id ? 'вашем бане' : 'бане другого игрока'}`)
                .setColor(0x5865F2)
                .setDescription(
                    `> Модератор: \`${moderator?.globalName || moderator?.username || ban.moderatorID} ${moderator ? `(${ban.moderatorID})` : ''}\`\n` +
                    `> Забанил: \`${user.globalName || user.username} (${ban.userID})\`\n` +
                    `> По причине: \`${ban.reason || 'не указана'}\`\n` +
                    `> Бан истекает: <t:${Math.floor(ban.timeout / 1000)}>`
                )
                .addFields([
                    { 
                        name: 'Не согласны с решением?',
                        value: 'Для вас всегда открыт канал <#969995793111064598>, а именно раздел подачи жалоб'
                    }
                ])
            ]
        });
    }
}

module.exports = BaninfoCommand;