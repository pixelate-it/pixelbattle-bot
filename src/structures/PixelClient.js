const { Client, Collection } = require('discord.js');
const { MongoClient } = require('mongodb');
const PointsHelper = require('../helpers/PointsHelper');

const loadListeners = require('../helpers/loadListeners');
const loadCommands = require('../helpers/loadCommands');

class PixelClient extends Client {
    constructor(options) {
        super(options);
        this.config = require('../../settings.json');
        this.functions = require('../utils/PixelFunctions');
        this.constants = require('../extra/Constants');

        this.mongo = new MongoClient(this.config.database);

        this.points = new PointsHelper(this);

        this.moderators = new Collection();
        this.listeners = new Collection();
        this.commands = new Collection();
    }

    get database() {
        return this.mongo.db('pixelbattle');
    }

    async _launch() {
        await this.mongo.connect();
        await loadListeners(this, '../listeners');
        await loadCommands(this, '../commands');
        return this.login(this.config.token).catch(console.error);
    }
}

module.exports = PixelClient;