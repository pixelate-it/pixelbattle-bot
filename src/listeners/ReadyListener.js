const PixelListener = require('../structures/PixelListener');
//const BansManager = require('../managers/BansManager');

class ReadyListener extends PixelListener {
    constructor() {
        super('ReadyListener', { event: 'ready' });
    }

    async run(client) {
        await client.guilds.cache.get(client.guilds.cache.first().id).members.fetch().then(() => console.log('* [CACHE] The list of players has been updated'));
        //await new BansManager(client).handle(); # doesn't work because ban is stored in the user

        client.user.setPresence({ status: 'idle', activities: [{ name: 'pixelbattle.fun' }] });
        console.log('* [ROOT] Bot launched');
    }
}

module.exports = ReadyListener;