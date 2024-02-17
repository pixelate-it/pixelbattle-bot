const PixelCommand = require('../structures/PixelCommand');
const fetch = require('node-fetch');

class GameCommand extends PixelCommand {
    constructor() {
        super('game', {
            aliases: ['g'],
            cooldown: 3
        });
    }

    async run(message, args) {
        if(!message.client.permissions.admin.has(message.author.id))
            return message.reply({ content: 'Вы не являетесь администратором, доступ к команде ограничен' });

        if(isNaN(Number(args[0]))) {
            if(!(['start', 'stop'].includes(args[0]))) {
                const name = args.join(' ');
                if(name.length > 32)
                    return message.reply({ content: `Имя игры не может быть больше 32 символов` });

                fetch(`${message.client.config.api_domain}/game/change`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: message.client.config.insideToken,
                        name
                    })
                });

                return message.reply({ content: `Название игры было изменено` });
            }

            const ended = (args[0] !== 'start');
            fetch(`${message.client.config.api_domain}/game/change`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: message.client.config.insideToken,
                    ended
                })
            });

            return message.reply({ content: `Игра была успешно ${ended ? 'завершена' : 'запущена'}` });
        } else {
            const cooldown = Number(args[0]);
            if(cooldown <= 0)
                return message.reply({ content: 'Кулдаун не может нулём и меньше' });
            if(!Number.isInteger(cooldown))
                return message.reply({ content: 'Кулдаун должен быть целым числом' });

            fetch(`${message.client.config.api_domain}/game/change`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: message.client.config.insideToken,
                    cooldown
                })
            });

            return message.reply({ content: `Как кулдаун игры было установлено значение в \`${cooldown}ms\`` });
        }
    }
}

module.exports = GameCommand;