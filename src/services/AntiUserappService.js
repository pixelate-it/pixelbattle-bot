class AntiUserappService {
    constructor(client) {
        this.client = client;
    }

    async checkMessage(message) {
        if(!message.author.bot) return true;
        const member = message.member || await message.guild.members.fetch(message.author.id).catch(() => null);
        if(member !== null) return true;

        await message.delete().catch(() => {});
        return false;
    }
}

module.exports = AntiUserappService;