import { Client, Collection } from "discord.js";
import type { PixelListener } from "./PixelListener";
import { loadListeners } from "@helpers";
import { config } from "@config";

export class PixelClient extends Client {
    public events: Collection<string, PixelListener<any>> = new Collection();

    async run() {
        loadListeners(this);
        return this.login(config.token).catch(console.error);
    }
}
