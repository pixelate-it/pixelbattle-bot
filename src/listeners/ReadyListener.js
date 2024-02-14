const PixelListener = require('../structures/PixelListener');
const BanRemoverService = require('../services/BanRemoverService');

const statuses = [
    ['pixelbattle.fun', 0],
    ['за холстом', 3],
    ['брызги краски', 2],
    ['таймлапсы', 3]
];
let x = 0;

class ReadyListener extends PixelListener {
    constructor() {
        super('ReadyListener', { event: 'ready' });
    }

    async run(client) {
        await client.guilds.cache.get(client.guilds.cache.first().id).members.fetch().then(() => console.log('* [CACHE] The list of players has been updated'));
        await new BanRemoverService(client).runClearance();

        setInterval(() => {
            client.user.setPresence({ status: 'idle', activities: [{ name: statuses[x][0], type: statuses[x][1] }] });
            x++;
            x %= statuses.length;
        }, 20000);

        console.log('* [ROOT] Bot launched');
    }
}

module.exports = ReadyListener;