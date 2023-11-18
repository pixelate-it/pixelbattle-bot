const BaseManager = require('../structures/BaseManager');
//const fetch = require('node-fetch');

class ModeratorsManager extends BaseManager {
    constructor(client) {
        super('moderators', client);
    }

    async fetch() {
        return await this.client.database
            .collection('moderators')
            .find({}, { projection: { _id: 0 } })
            .toArray()
            .then((arr) => arr.map((_) => this.client.moderators.set(_.userID, _)));
    }
}

module.exports = ModeratorsManager;