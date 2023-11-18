const path = require('path');
const fs = require('fs').promises;
const PixelListener = require('../structures/PixelListener');

module.exports = async function loadListeners(client, dir = '') {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for(const file of files) {
        const stat = await fs.lstat(path.join(filePath, file));
        if (stat.isDirectory()) {
            await loadListeners(client, path.join(dir, file));
        }
        if(file.endsWith('.js')) {
            const Listener = require(path.join(filePath, file));
            if(Listener.prototype instanceof PixelListener) {
                const listener = new Listener();
                client.listeners.set(listener.name, listener);
                client.on(listener.event, listener.run.bind(listener, client));
                if(listener.ws) client.ws.on(listener.event, listener.run.bind(listener, client));
                console.log(`* [LOADER] "${listener.event}" event loaded`)
            }
        }
    }
}