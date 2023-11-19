const PixelCommand = require('../structures/PixelCommand');
const BansManager = require('../managers/BansManager');
const { EmbedBuilder } = require('discord.js');
const { ms } = require('../utils/PixelFunctions');
const fetch = require('node-fetch');

class TokenCommand extends PixelCommand {
    constructor() {
        super('token', {
            cooldown: 3,
            aliases: ['t']
        });
    }

    async run(message, args) {
        if(!message.client.moderators.has(message.author.id)) 
            return message.reply({ content: 'Вы не являетесь модератором чтобы использовать эту команду!' });

        switch(args[0]) {
            case 'ban':
            case 'unban': {
                const manager = new BansManager(message.client);
                const action = (args[0] == 'unban') ? false : true;
                const user = message.mentions.users.first() || message.client.users.cache.get(args[action ? 2 : 1]) || await message.client.users.fetch(args[action ? 2 : 1]).catch(() => {});

                if(action) { 
                    var time = args[1];
                    if(!ms(time)) 
                        { message.reply({ content: 'Укажите правильную длительность бана, например \`28d\`' }); break; };
                    if(!ms(time) || ms(time) > ms('2000d') || ms(time) < ms('1s')) 
                        { message.reply({ content: 'Минимальная длительность бана - 1 секунда, максимальная - 2000 дней' }); break; };

                    time = ms(time);
                }

                if(!user) 
                    { message.reply({ content: 'Указанный вами игрок не был найден' }); break; };
                if(message.client.moderators.has(user.id) && (message.author.id !== message.client.config.owner)) 
                    { message.reply({ content: `Вы не можете проводить это действие с модератором` }); break; };

                const reason = args.slice(action ? 3 : 2).join(' ') || null;
                const assumption = await manager.find({ userID: user.id });
                if(action ? assumption : !assumption) 
                    { message.reply({ content: `Вы не можете ${action ? 'забанить' : 'разбанить'} человека, который уже ${action ? '' : 'не '}в бане` }); break; };

                const msg = await message.reply({ content: 'Производятся записи в базе данных и сервере Pixel Battle...' });

                fetch(`${message.client.config.api_domain}/bans/${user.id}/edit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        token: message.client.config.insideToken, 
                        action
                    })
                });

                switch(action) {
                    case true:
                        await manager.create({
                            userID: user.id,
                            moderatorID: message.author.id,
                            timeout: Date.now() + time,
                            reason
                        });
                        break;

                    case false:
                        await manager.delete({
                            userID: user.id
                        });
                        break;
                }

                msg.edit({
                    content: null,
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`🦜 | Информация о выдаче ${action ? 'бана' : 'разбана'}`)
                        .setColor(0x5865F2)
                        .setDescription(
                            `> Модератор: \`${message.author.globalName || message.author.username} (${message.author.id})\`\n` +
                            `> ${action ? 'Забанил' : 'Разбанил'}: \`${user.globalName || user.username} (${user.id})\`\n` +
                            `> По причине: \`${reason || 'не указана'}\`\n` +
                            `${action ? `> Бан истекает: <t:${Math.floor((Date.now() + time) / 1000)}>` : ''}`
                        )
                        .addFields(
                            [
                                { 
                                    name: 'Не согласны с решением?',
                                    value: 'Для вас всегда открыт канал <#969995793111064598>, а именно раздел подачи жалоб'
                                }
                            ]
                        )
                        .setTimestamp()
                    ]
                }).catch();

                break;
            }

            case 'regenerate':
            case 'regen':
            case 'r': {
                if(!message.client.config.owner.includes(message.author.id)) return message.react('❌');

                const user = message.mentions.users.first() || message.client.users.cache.get(args[1]) || await message.client.users.fetch(args[1]).catch(() => {});
                if(!user) 
                    { message.reply({ content: `Укажите игрока для проведения регенерации токена` }); break; };

                const data = await message.client.database.collection('users').findOne({ userID: user.id }, { projection: { _id: 0, token: 1 } });
                if(!data) { message.reply({ content: `Не найдено записи о данном игроке в базе данных` }); break; };

                message.client.database.collection('users').updateOne({ userID: user.id },
                    {
                        $set: {
                            token: message.client.functions.generateToken(parseInt(data.token.split('.')[1], 36)), 
                        }
                    }
                );

                message.reply({ content: `Токен игрока ${`${user.globalName ?? user.username ?? user.tag} (**${user.id}**)`} был успешно перегенерирован!` });

                break;
            }

            default: {
                message.reply({ content: 'Используйте только ban/unban/regenerate' })
                break;
            }
        }
        
        return;
    }
}

module.exports = TokenCommand;