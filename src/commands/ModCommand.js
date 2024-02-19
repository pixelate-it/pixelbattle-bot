const PixelCommand = require('../structures/PixelCommand');
const fetch = require('node-fetch');
const { codeBlock } = require('discord.js');

class ModeratorCommand extends PixelCommand {
    constructor() {
        super('moderator', {
            aliases: ['mod', 'm'],
            cooldown: 3
        });
    }

    async run(message, args) {
        if(!message.client.permissions.special.has(message.author.id))
            return message.react('❌');
        if(!(['add', 'remove'].includes(args[0]))) 
            return message.reply({ content: `Используйте только add/remove` });

        const user = message.mentions.members.first()?.id || args[1];
        if(!user) 
            return message.reply({ content: 'Укажите участника для проведения действия' });
        const action = (args[0] !== 'remove');
        if(action === message.client.permissions.moderator.has(user))
            return message.reply({ content: `Указанный вами модератор уже **${action ? 'является' : 'не является'}** модератором` });

        const msg = await message.reply(`Смена роли игрока \`${user}\` в процессе...`);

        const request = await fetch(`${message.client.config.api_domain}/moderators/${user}/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + (await message.client.database.collection('users').findOne(
                    { userID: message.author.id },
                    { projection: { _id: 0, token: 1 }, hint: { userID: 1 } }
                ))?.token
            },
            body: JSON.stringify({
                action
            })
        }).then(res => res?.json()).catch(() => {});

        if(request?.error ?? !request) {
            if(request?.reason === 'NotEnoughPrivileges') return msg.edit({
                content: 'Смена роли не удалась! Возможная причина: ваша роль в API PixelBattle не является админской (2)\n'
                    + codeBlock('json', JSON.stringify(request))
            });

            return msg.edit({
                content: 'Смена роли не удалась!\n'
                    + codeBlock('json', JSON.stringify(request ?? null))
            });
        }

        message.client.permissions.moderator[action ? 'add' : 'delete'](user);
        message.client.database.collection('users')
            .updateOne(
                { userID: user },
                { $set: { role: Number(action) } },
                { upsert: true, hint: { userID: 1 } }
            );

        message.guild.members.cache.get(user).roles[action ? 'add' : 'remove']('969950074874515476').catch(() => {});

        return msg.edit({ content: `Модератор <@${user}> был успешно **${action ? 'назначен' : 'снят'}**!` });
    }
}

module.exports = ModeratorCommand;