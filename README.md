# PixelBattle Discord Bot
## Usage
1. You can view live version of this bot on our [Discord server](https://discord.gg/XBPyGUv3DT)

**or you can run it locally:**

1. Install dependencies with `npm i`
2. Fill out settings.json using the form below
3. Save the changes, and start bot with `npm run prod` command

## settings.json form
```json
{
    "database": "",
    "dbname": "pixelbattle",
    "token": "",
    "insideToken": "",
    "api_domain": "",
    "owner": [],
    "prefix": "p!",
    "SYSTEM_TOKEN": ""
}
```
where:  
`database` - mongodb url connection string  
`dbname` - name of the database where the data will be stored  
`token` - Discord bot token, get [here (DDevs)](https://discord.com/developers/applications)  
`insideToken` - token used for communication between the bot and the API  
`api_domain` - API domain with protocol  
`owner` - array with discord account IDs, used for special commands  
`prefix` - prefix used by the bot  
`SYSTEM_TOKEN` - bot user token in the database (you must create it yourself)  