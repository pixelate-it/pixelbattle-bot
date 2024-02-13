const { config: dotenvConfig } = require('dotenv');
const { join } = require('path');

dotenvConfig({ path: join(__dirname, '../.env') });

module.exports = {
    prefix: 'p!',
    database: process.env.DATABASE,
    dbname: new URL(process.env.DATABASE).pathname.slice(1),
    token: process.env.TOKEN,
    api_domain: process.env.API_DOMAIN,
    owner: process.env.OWNER?.split(','),
    SYSTEM_TOKEN: process.env.SYSTEM_TOKEN,
    notificationChannel: process.env.NOTIFICATION_CHANNEL,
    maximumNewAccountDetectionTime: 7776000000,
}