const PixelListener = require('../structures/PixelListener');
const ModeratorsManager = require('../managers/ModeratorsManager');
const BansManager = require('../managers/BansManager');

class ReadyListener extends PixelListener {
    constructor() {
        super('ReadyListener', { event: 'ready' });
    }

    async run(client) {
        await client.guilds.cache.get('969933616090075216').members.fetch().then(() => console.log('* [CACHE] The list of players has been updated'));
        await new ModeratorsManager(client).fetch().then(console.log('* [CACHE] The list of moderators has been updated'));
        await new BansManager(client).handle();

        client.user.setPresence({ status: 'idle', activities: [{ name: 'pixelbattle.fun' }] });
        console.log('* [ROOT] Bot launched');
    }
}

module.exports = ReadyListener;