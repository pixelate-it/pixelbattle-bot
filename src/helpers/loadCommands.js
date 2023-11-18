const path = require('path');
const fs = require('fs').promises;
const PixelCommand = require('../structures/PixelCommand');

module.exports = async function loadCommands(client, dir = '') {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for(const file of files) {
        const stat = await fs.lstat(path.join(filePath, file));
        if(stat.isDirectory()) {
            await loadCommands(client, path.join(dir, file));
        }
        if(file.endsWith('.js')) {
            const Command = require(path.join(filePath, file));
            if(Command.prototype instanceof PixelCommand) {
                const cmd = new Command();
                client.commands.set(cmd.name, cmd);
                console.log(`* [LOADER] "${cmd.name}" command loaded`)
            }
        }
    }
}