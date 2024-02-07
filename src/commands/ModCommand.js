const PixelCommand = require('../structures/PixelCommand');
const fetch = require('node-fetch');

class ModeratorCommand extends PixelCommand {
    constructor() {
        super('moderator', {
            aliases: ['mod', 'm'],
            cooldown: 3
        });
    }

    async run(message, args) {
        // further development
        if(!message.client.permissions.special.includes(message.author.id))
            return message.react('❌');
        if(!(['add', 'remove'].includes(args[0]))) 
            return message.reply({ content: `Используйте только add/remove` });

        const user = message.mentions.members.first()?.id || args[1];
        if(!user) 
            return message.reply({ content: 'Укажите участника для проведения действия' });
        const action = (args[0] != 'remove');
        if(action === message.client.permissions.moderator.includes(user))
            return message.reply({ content: `Указанный вами модератор уже **${action ? 'является' : 'не является'}** модератором` });

        message.client.moderators[action ? 'set' : 'delete'](user, { userID: user });
        if(action) message.client.database.collection('moderators')
            .updateOne({ userID: user }, { $set: { warns: 0 } }, { upsert: true });
        else message.client.database.collection('moderators')
            .deleteOne({ userID: user });

        fetch(`${message.client.config.api_domain}/moderators/${user}/edit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                token: message.client.config.insideToken,
                action
            })
        });

        message.guild.members.cache.get(user).roles[action ? 'add' : 'remove']('969950074874515476').catch(() => {});

        return message.reply({ content: `Модератор <@${user}> был успешно **${action ? 'назначен' : 'снят'}**!` });
    }
}

module.exports = ModeratorCommand;