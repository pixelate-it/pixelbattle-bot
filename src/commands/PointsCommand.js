const PixelCommand = require('../structures/PixelCommand');
const { EmbedBuilder } = require('discord.js');

class PointsCommand extends PixelCommand {
    constructor() {
        super('points', {
            cooldown: 3,
            aliases: ['point', 'marks', 'mark']
        });
    }

    async run(message, args) {
        switch(args[0]) {
            case 'edit':
            case 'change': {
                if(!message.client.permissions.special.includes(message.author.id))
                    { message.react('❌'); break; }

                const change = Number(args[1]);
                if(isNaN(change)) 
                    { message.reply({ content: 'Как второй аргумент укажите целое число, на которое необходимо изменить счётчик баллов' }); break; }
                if(!Number.isInteger(change)) 
                    { message.reply({ content: 'Как второй аргумент укажите целое число, на которое необходимо изменить счётчик баллов' }); break; }

                const target = message.mentions.members?.first() || message.guild.members.cache.get(args[2]);
                if(!target) 
                    { message.reply({ content: 'Указанный вами игрок не был найден' }); break; }

                await message.client.points.updatePoints(target.id, change);
                message.reply({ content: `Вы успешно изменили на **${change}** баллы участника ${target.nickname || target.user.globalName || target.user.username} (**${target.id}**)` });
                break;
            }

            case 'leaderboard':
            case 'leaders':
            case 'leader': {
                const msg = await message.reply({ content: 'Идёт построение таблицы лидеров...' });
                let users = await message.client.database.collection('users').find({}, { userID: 1, username: 1, points: 1 }).toArray();
                users = users.filter(u => u.points !== 0);

                let i = 1;
                msg.edit({
                    content: null,
                    embeds: [
                        new EmbedBuilder()
                        .setTitle('Таблица лидеров')
                        .setColor(0x5865F2)
                        .setDescription(
                            `\`Позиция в топе\`. \`Игрок\` - \`количество баллов\`\n` +
                            users.sort((x, y) => y.points - x.points).map((u) => `${i++}. <@${u.userID}> - ${u.points}`).join('\n')
                        )
                        .setFooter({ text: 'Больше заработанных баллов - больше вклад в проект' })
                        .setTimestamp()
                    ]
                });
                break;
            } // need pages with buttons (components)

            default: {
                const target = message.mentions.members?.first() || message.guild.members.cache.get(args[0]) || message.member;
                const data = await message.client.database.collection('users').findOne({ userID: target.id });

                message.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`💡 Информация о ${message.member.equals(target) ? 'ваших баллах' : `баллах ${target.nickname || target.user.globalName || data.username}`}`)
                        .setColor(0x5865F2)
                        .setDescription(
                            `> Итоговое количество баллов: \`${data?.points || 0}\``
                        )
                        .setFooter({ text: message.client.constants.phrases.random() })
                        .setTimestamp()
                    ]
                });
                break;
            }
        }

        return;
    }
}

module.exports = PointsCommand;