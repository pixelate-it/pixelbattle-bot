const PixelListener = require('../../structures/PixelListener');
const AntiNewAccountService = require('../../services/AntiNewAccountService');

class MemberAddListener extends PixelListener {
    constructor() {
        super('MemberAddListener', { event: 'guildMemberAdd' });
    }

    run(client, member) {
        if(member.user.createdTimestamp >= (Date.now() - client.config.maximumNewAccountDetectionTime)) new AntiNewAccountService(client).sendNotification(member);
    }
}

module.exports = MemberAddListener;