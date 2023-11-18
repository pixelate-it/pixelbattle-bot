const BaseManager = require('../structures/BaseManager');
const fetch = require('node-fetch');

class BansManager extends BaseManager {
    constructor(client) {
        super('bans', client);
    }

    handle(checkInterval = 15000) {
        return setInterval(async() => {
            const bans = await this.client.database.collection(this.collection).find().toArray();
            
            for(const ban of bans) {
                const user = await this.client.users.cache.get(ban.userID);

                if(ban.timeout <= Date.now()) {
                    this.delete(ban);
                    fetch(`${this.client.config.api_domian}/bans/${user}/edit`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            token: message.client.config.insideToken, 
                            action: false 
                        })
                    });

                    user?.send({ content: `Ваш бан по причине \`${ban.reason}\` истёк. Вы снова можете играть на сайте https://pixelbattle.fun/` })
                    .catch(() => {})
                }
            }
        }, checkInterval);
    }
}

module.exports = BansManager;