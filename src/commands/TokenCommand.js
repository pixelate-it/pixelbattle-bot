const PixelCommand = require('../structures/PixelCommand');
//const BansManager = require('../managers/BansManager');
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
        if(!message.client.permissions.moderator.has(message.author.id))
            return message.reply({ content: 'Вы не являетесь модератором чтобы использовать эту команду!' });

        switch(args[0]) {
            case 'ban':
            case 'unban': {
                const action = (args[0] !== 'unban');
                const user = message.mentions.users.first() || message.client.users.cache.get(args[action ? 2 : 1]) || await message.client.users.fetch(args[action ? 2 : 1]).catch(() => {});

                if(action) { 
                    var timeout = args[1];
                    if(!ms(timeout))
                        { message.reply({ content: 'Укажите правильную длительность бана, например \`28d\`' }); break; };
                    if(!ms(timeout) || ms(timeout) > ms('2000d') || ms(timeout) < ms('1s'))
                        { message.reply({ content: 'Минимальная длительность бана - 1 секунда, максимальная - 2000 дней' }); break; };

                    timeout = ms(timeout) + Date.now();
                }

                if(!user) 
                    { message.reply({ content: 'Указанный вами игрок не был найден' }); break; };
                if(message.client.permissions.moderator.has(user.id) && !message.client.permissions.special.has(message.author.id))
                    { message.reply({ content: `Вы не можете проводить это действие с модератором` }); break; }

                const reason = args.slice(action ? 3 : 2).join(' ') || null;
                const assumption = (await message.client.database.collection('users').findOne({ userID: user.id }, { projection: { _id: 0, banned: 1 } }))?.banned;
                if(action ? assumption : !assumption) 
                    { message.reply({ content: `Вы не можете ${action ? 'забанить' : 'разбанить'} человека, который уже ${action ? '' : 'не '}в бане` }); break; }

                const msg = await message.reply({ content: 'Производятся записи в базе данных и API Pixel Battle...' });

                fetch(`${message.client.config.api_domain}/users/${user.id}/${args[0]}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + (await message.client.database.collection('users').findOne(
                            { userID: message.author.id },
                            { projection: { _id: 0, token: 1 } }
                        ))?.token
                    },
                    body: JSON.stringify({
                        timeout,
                        reason
                    })
                });

                await message.client.database.collection('users').updateOne(
                    {
                        userID: user.id
                    },
                    {
                        $set: {
                            banned: action ? {
                                moderatorID: message.author.id,
                                timeout,
                                reason
                            } : null
                        }
                    }
                )

                msg.edit({
                    content: null,
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`🦜 Информация о выдаче ${action ? 'бана' : 'разбана'}`)
                        .setColor(0x5865F2)
                        .setDescription(
                            `> Модератор: \`${message.author.globalName || message.author.username} (${message.author.id})\`\n` +
                            `> ${action ? 'Забанил' : 'Разбанил'}: \`${user.globalName || user.username} (${user.id})\`\n` +
                            `> По причине: \`${reason || 'не указана'}\`\n` +
                            `${action ? `> Бан истекает: <t:${Math.floor(timeout / 1000)}>` : ''}`
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
                if(!message.client.permissions.special.has(message.author.id)) return message.react('❌');

                const user = message.mentions.users.first() || message.client.users.cache.get(args[1]) || await message.client.users.fetch(args[1]).catch(() => {});
                if(!user) 
                    { message.reply({ content: `Укажите игрока для проведения регенерации токена` }); break; };

                const data = await message.client.database.collection('users').findOne({ userID: user.id }, { projection: { _id: 0, token: 1 } });
                if(!data) { message.reply({ content: `Не найдено записи о данном игроке в базе данных` }); break; }

                message.client.database.collection('users').updateOne({ userID: user.id },
                    {
                        $set: {
                            token: message.client.functions.generateToken(parseInt(data.token.split('.')[2], 36)),
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