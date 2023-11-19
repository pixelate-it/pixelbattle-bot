const PixelCommand = require('../structures/PixelCommand');
const hexRegExp = /^#[0-9A-F]{6}$/i;

class ClearCommand extends PixelCommand {
    constructor() {
        super('clear', {
            cooldown: 5,
            aliases: []
        });
    }

    async run(message, args) {
        if(![...message.client.config.owner, '578729769898737668'].includes(message.author.id)) 
            return message.reply({ content: 'Вы не являетесь создателем проекта/специальным модератором, доступ к команде ограничен' });
        const hex = (args[0] ?? '#FFFFFF');
        if(!hexRegExp.test(hex)) 
            return message.reply({ content: 'Введите верный HEX-код' });

        const msg = await message.reply({ content: `Производится очистка холста...` });

        const data = await fetch(`${message.client.config.api_domain}/info`, { method: 'GET' })
            .then(res => res.json());

        if(data?.error ?? !data) return msg.edit({ content: 'API PixelBattle недоступно в данный момент, регенерация холста не возможна' })

        await message.client.database.collection('pixels').drop();
        await message.client.database.collection('pixels')
        .insertMany(
            new Array(data.canvas.width * data.canvas.height).fill(0)
            .map((_, i) => ({ x: i % data.canvas.width, y: Math.floor(i / process.env.width), color: hex, author: null, tag: null })),
            { ordered: true }
        );

        return msg.edit({ content: `Холст ${data.canvas.width}x${data.canvas.height} был успешно очищен! Как его цвет был установлен - \`${hex}\`` });
    }
}

module.exports = ClearCommand;