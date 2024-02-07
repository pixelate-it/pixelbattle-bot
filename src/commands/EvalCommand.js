const Discord = require('discord.js');
const PixelCommand = require('../structures/PixelCommand');

class EvalCommand extends PixelCommand {
    constructor() {
        super('eval', {
            aliases: ['evaluation', 'e', '>'],
            cooldown: 1
        });
    }

    async run(message, args) {
        const util = require('util');
        let code = args.join(' ');
        let isAsync = false;

        try {
            if(!message.client.permissions.special.includes(message.author.id))
                return message.react('❌');
            if(!code) 
                return message.reply({ content: 'Введите код, который необходимо выполнить!' });
            code = code.replace(/(```(.+)?)?/g, '');
            if(code.includes('await')) isAsync = true;
            if(isAsync) code = `(async() => {${code}})()`;
            //const before = process.hrtime.bigint();
            let executed = eval(code);
            if(util.types.isPromise(executed)) executed = await executed;
            //const after = process.hrtime.bigint();
            if(typeof executed !== 'string') executed = util.inspect(executed, { depth: 0, maxArrayLength: null });
            if(executed.length >= 1500) {
                let _i = 0;
                return executed.match(/.{1,1960}(\n|$)/gs).map(async(string) => await
                    (
                        _i++
                        ? message.channel.send({ content: Discord.codeBlock('js', string) }) 
                        : message.reply({ content: Discord.codeBlock('js', string), allowedMentions: { repliedUser: false } })
                    )
                )
            }
            message.reply({ content: Discord.codeBlock('js', executed) });
        } catch(error) {
            message.reply({ content: Discord.codeBlock('js', error) });
        }
    }
}

module.exports = EvalCommand;