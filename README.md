# PixelBattle Discord Bot
## Usage
1. You can view live version of this bot on our [Discord server](https://discord.gg/XBPyGUv3DT)

**or you can run it locally:**

1. Install dependencies with `npm i`
2. Fill out `.env` using the instructions below
3. Save the changes, and start bot with `npm run prod` command

## `.env` form
you can see the `.env` example in the `.env.example` file

`DATABASE` - mongodb url connection string  
`TOKEN` - discord bot token, get [here (DDevs)](https://discord.com/developers/applications)  
`API_DOMAIN` - pixelbattle API domain with protocol  
`SYSTEM_TOKEN` - bot user token in the database (you must create it yourself)  
`NOTIFICATION_CHANNEL` - discord channel ID where notifications about new accounts will be sent
`OWNER` - IDs of discord accounts that can use commands such as p!mod, p!eval and others (you can make array using ",")