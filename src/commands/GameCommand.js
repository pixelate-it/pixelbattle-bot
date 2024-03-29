const PixelCommand = require('../structures/PixelCommand');
const fetch = require('node-fetch');
const { codeBlock } = require('discord.js');

class GameCommand extends PixelCommand {
    constructor() {
        super('game', {
            aliases: ['g'],
            cooldown: 3
        });
    }

    async run(message, args) {
        // needs refactor
        if(!message.client.permissions.admin.has(message.author.id))
            return message.reply({ content: 'Вы не являетесь администратором, доступ к команде ограничен' });

        if(isNaN(Number(args[0]))) {
            if(!(['start', 'stop'].includes(args[0]))) {
                const name = args.join(' ');
                if(name.length > 32)
                    return message.reply({ content: `Имя игры не может быть больше 32 символов` });

                const request = await fetch(`${message.client.config.api_domain}/game/change`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + (await message.client.database.collection('users').findOne(
                            { userID: message.author.id },
                            { projection: { _id: 0, token: 1 } }
                        ))?.token
                    },
                    body: JSON.stringify({ name })
                }).then(res => res?.json()).catch(() => {});

                if(request?.error ?? !request) return message.reply({ content: request ? codeBlock('json', JSON.stringify(request)) : 'От API поступил пустой ответ, возможно, стоит проверить его состояние' });

                return message.reply({ content: `Название игры было изменено` });
            }

            const ended = (args[0] !== 'start');
            const msg = await message.reply({ content: 'Смена игрового статуса в процессе...' });

            const request = await fetch(`${message.client.config.api_domain}/game/change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + (await message.client.database.collection('users').findOne(
                        { userID: message.author.id },
                        { projection: { _id: 0, token: 1 }, hint: { userID: 1 } }
                    ))?.token
                },
                body: JSON.stringify({ ended })
            }).then(res => res?.json()).catch(() => {});

            if(request?.error ?? !request) return msg.edit({ content: request ? codeBlock('json', JSON.stringify(request)) : 'От API поступил пустой ответ, возможно, стоит проверить его состояние' });

            return msg.edit({ content: `Игра была успешно ${ended ? 'завершена' : 'запущена'}` });
        } else {
            const cooldown = Number(args[0]);
            if(cooldown <= 0)
                return message.reply({ content: 'Кулдаун не может нулём и меньше' });
            if(!Number.isInteger(cooldown))
                return message.reply({ content: 'Кулдаун должен быть целым числом' });

            const request = await fetch(`${message.client.config.api_domain}/game/change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + (await message.client.database.collection('users').findOne(
                        { userID: message.author.id },
                        { projection: { _id: 0, token: 1 }, hint: { userID: 1 } }
                    ))?.token
                },
                body: JSON.stringify({ cooldown })
            }).then(res => res?.json()).catch(() => {});

            if(request?.error ?? !request) return message.reply({ content: request ? codeBlock('json', JSON.stringify(request)) : 'От API поступил пустой ответ, возможно, стоит проверить его состояние' });

            return message.reply({ content: `Как кулдаун игры было установлено значение в \`${cooldown}ms\`` });
        }
    }
}

module.exports = GameCommand;