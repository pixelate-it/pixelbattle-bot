require('./utils/PixelExtenders');

const { IntentsBitField } = require('discord.js');
const PixelClient = require('./structures/PixelClient');

const client = new PixelClient({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildInvites,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client._launch().catch(console.error);