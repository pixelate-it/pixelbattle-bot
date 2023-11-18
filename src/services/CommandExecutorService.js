const { Collection } = require('discord.js');

const cooldown = new Collection();

class CommandExecutorService {
    constructor(message, client) {
        this.message = message;
        this.client = client;
    }

    findCommand(commandName) {
        const command = this.client?.commands.get(commandName);
        if(command) {
            return command;
        } else return this.client?.commands.find((c) => c?.aliases.includes(commandName));
    }

    async runCommand() {
        if(!this.message.content.startsWith(this.client.config.prefix)) return;

        const [cmd, ...args] = this.message.content.slice(this.client.config.prefix.length).trim().split(/ +/g);
        const command = await this.findCommand(cmd);

        if(cooldown.has(this.message.author.id) && cooldown.get(this.message.author.id) === command?.name) 
            return this.message.react('⏱️').catch();

        if(command) {
            try {
                await command.run(this.message, args);
            } catch(error) {
                console.error(error);
            }

            cooldown.set(this.message.author.id, command.name);
            setTimeout(() => cooldown.delete(this.message.author.id), command.cooldown * 1000);
        }
    }
}

module.exports = CommandExecutorService;