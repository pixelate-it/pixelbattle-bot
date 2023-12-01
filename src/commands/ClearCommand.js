const PixelCommand = require('../structures/PixelCommand');
const fetch = require("node-fetch");
const hexRegExp = /^#[0-9A-F]{6}$/i;

class ClearCommand extends PixelCommand {
    constructor() {
        super('clear', {
            cooldown: 5,
            aliases: ['clr']
        });
    }

    async run(message, args) {
        if(![...message.client.config.owner, '578729769898737668'].includes(message.author.id)) 
            return message.reply({ content: 'Вы не являетесь создателем проекта/специальным модератором, доступ к команде ограничен' });
        const color = (args[0] ?? '#FFFFFF');
        if(!hexRegExp.test(color))
            return message.reply({ content: 'Введите верный HEX-код' });

        const msg = await message.reply({ content: `Производится очистка холста...` });

        const data = await fetch(`${message.client.config.api_domain}/pixels/clear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: message.client.config.insideToken,
                color
            })
        }).then(res => res.json());

        if(data?.error ?? !data)
            return msg.edit({ content: 'API PixelBattle недоступно в данный момент, регенерация холста не возможна' });

        return msg.edit({ content: `Холст ${data.canvas.width}x${data.canvas.height} был успешно очищен! Как его цвет был установлен - \`${color}\`` });
    }
}

module.exports = ClearCommand;