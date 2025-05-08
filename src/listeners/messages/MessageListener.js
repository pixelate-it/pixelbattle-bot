const PixelListener = require('../../structures/PixelListener');
const CommandsExecutorService = require('../../services/CommandExecutorService');
const AntiUserappService = require('../../services/AntiUserappService');

class MessageListener extends PixelListener {
    constructor() {
        super('MessageListener', { event: 'messageCreate' });
    }

    async run(client, message) {
        if(!message.guild) return;

        const antiUserapp = new AntiUserappService(client);
        if(!await antiUserapp.checkMessage(message)) return;

        if(message.author.bot) return;

        const executor = new CommandsExecutorService(message, client);
        return executor.runCommand();
    }
}

module.exports = MessageListener;