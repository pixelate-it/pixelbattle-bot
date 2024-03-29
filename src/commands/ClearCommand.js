const PixelCommand = require('../structures/PixelCommand');
const fetch = require("node-fetch");
const hexRegExp = /^#[0-9A-F]{6}$/i;
const { codeBlock } = require('discord.js');

class ClearCommand extends PixelCommand {
    constructor() {
        super('clear', {
            cooldown: 5,
            aliases: ['clr']
        });
    }

    async run(message, args) {
        if(!message.client.permissions.admin.has(message.author.id))
            return message.reply({ content: 'Вы не являетесь создателем проекта/администратором, доступ к команде ограничен' });
        const color = (args[0] ?? '#FFFFFF');
        if(!hexRegExp.test(color))
            return message.reply({ content: 'Введите верный HEX-код' });

        const msg = await message.reply({ content: `Производится очистка холста...` });

        const data = await fetch(`${message.client.config.api_domain}/pixels/clear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + (await message.client.database.collection('users').findOne(
                    { userID: message.author.id },
                    { projection: { _id: 0, token: 1 }, hint: { userID: 1 } }
                ))?.token
            },
            body: JSON.stringify({
                color
            })
        }).then(res => res.json()).catch(() => {});

        if(data?.error ?? !data) {
            if(data?.reason === 'NotEnoughPrivileges') return msg.edit({
                content: 'Судя по всему, в кэше API Pixel Battle вы не являетесь модератором или выше\n'
                    + codeBlock('json', JSON.stringify(data))
            });

            return msg.edit({
                content: 'API PixelBattle недоступно в данный момент, регенерация холста не возможна\n'
                    + codeBlock('json', JSON.stringify(data || null))
            });
        }

        return msg.edit({ content: `Холст ${data.canvas.width}x${data.canvas.height} был успешно очищен! Как его цвет был установлен - \`${color}\`` });
    }
}

module.exports = ClearCommand;