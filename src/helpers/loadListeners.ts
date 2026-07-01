import { PixelClient } from "@structures/PixelClient";
import { listeners } from "@listeners";

export function loadListeners(client: PixelClient) {
    for (const listener of listeners) {
        client.events.set(listener.name, listener);

        const handler = (...args: any[]) => listener.run(...args);

        if (listener.once) client.once(listener.event, handler);
        else client.on(listener.event, handler);

        console.log(`* [LOAD] Loaded "${listener.name}" event`);
    }
}
