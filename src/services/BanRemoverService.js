const fetch = require('node-fetch');

class BanRemoverService {
    constructor(client) {
        this.client = client;
    }

    clear(id) {
        return this.client.database.collection('users').updateOne({ userID: id }, { $set: { banned: null } });
    }

    runClearance(checkInterval = 15000) {
        return setInterval(async() => {
            const banned = await this.client.database.collection('users').find({ banned: { $ne: null } }).toArray();
            for(const data of banned) {
                const user = await this.client.users.cache.get(data.userID);

                if(data.banned.timeout <= Date.now()) {
                    const response = await fetch(`${this.client.config.api_domain}/users/${data.userID}/unban`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${this.client.config.SYSTEM_TOKEN}`
                        },
                        body: JSON.stringify({
                            reason: `Ban time ${data.userID} is over`
                        })
                    }).then(res => res.json()).catch(() => {});
                    if(response?.error ?? !response) return console.error(`I couldn't unban ${data.userID} ${response ? 'with reason' + JSON.stringify(response) : ''}`);

                    this.clear(data.userID);

                    user?.send({ content: `Ваш бан по причине \`${user.banned?.reason}\` истёк. Вы снова можете играть на сайте https://pixelbattle.fun/` })
                        .catch(() => {})
                }
            }
        }, checkInterval);
    }
}

module.exports = BanRemoverService;