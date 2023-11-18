const PixelCommand = require('../structures/PixelCommand');
const { EmbedBuilder, version } = require('discord.js');
const { version: gamever, dependencies } = require('../../package.json');

class PingCommand extends PixelCommand {
    constructor() {
        super('ping', {
            cooldown: 3,
            aliases: ['health', 'check']
        });
    }

    async run(message, args) {
        const msg = await message.reply({ content: 'Идёт подсчёт результатов...' });
        const after = Date.now();

        return msg.edit({ 
            embeds: [
                new EmbedBuilder()
                .setTitle('🛠️ Проверка моего состояния')
                .setColor(0x5865F2)
                .setDescription(
                    `> Пинг подключения к WebSocket: \`${message.client.ws.ping}ms\`\n` +
                    `> Пинг отправки сообщения: \`${after - msg.createdTimestamp}ms\`\n` +
                    `> Версия Discord.JS: \`${version}\`\n` +
                    `> Версия Fastify: \`${dependencies.fastify.slice(1)}\`\n` +
                    `> Версия игры: \`${gamever}\``
                )
                .setFooter({ text: `https://${message.client.config.main_domian}/`, iconURL: 'https://i.imgur.com/dgxDCnZ.png' })
                .setTimestamp()
            ],
            content: null
        });
    }
}

module.exports = PingCommand;