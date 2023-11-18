const PixelCommand = require('../structures/PixelCommand');
const { EmbedBuilder } = require('discord.js');

class TagCommand extends PixelCommand {
    constructor() {
        super('tag', {
            cooldown: 3,
            aliases: [],
        });
    }

    async run(message, args) {
        const tag = args.join(' ');
        if(!tag) 
            return message.reply({ content: 'Укажите тег, участников которого хотите посмотреть' });

        const data = await message.client.database.collection('users')
            .find({ tag })
            .toArray();
        if(data.length <= 0) 
            return message.reply({ content: `Игроков, использующих тег \`${tag}\` не найдено!` });

        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Игроки с тегом ${tag} (итого ${data.length})`)
                .setColor(0x5865F2)
                .setDescription(
                    data.map(d => `<@${d.userID}> (${d.userID})`).join('\n')
                )
            ]
        }); // need pages with buttons (components)
    }
}

module.exports = TagCommand;