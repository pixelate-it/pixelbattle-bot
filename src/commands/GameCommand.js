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
        if(![...message.client.config.owner, '578729769898737668'].includes(message.author.id)) 
            return message.reply({ content: 'Вы не являетесь создателем проекта/специальным модератором, доступ к команде ограничен' });
        if(!(['start', 'stop'].includes(args[0]))) 
            return message.reply({ content: `Используйте только start/stop` });

        const ended = (args[0] != 'start');
        fetch(`${message.client.config.api_domain}/game/change`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                token: message.client.config.insideToken,
                ended
            })
        });

        return message.reply({ content: `Игра была успешно ${ended ? 'завершена' : 'запущена'}` });
    }
}

module.exports = GameCommand;