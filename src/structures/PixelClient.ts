import { Client, Collection } from "discord.js";
import type { PixelListener } from "./PixelListener";
import type { PixelButton } from "./PixelButton";
import { loadListeners, loadButtons } from "@helpers";
import { config } from "@config";

export class PixelClient extends Client {
    public events: Collection<string, PixelListener<any>> = new Collection();
    public buttons: Collection<string, PixelButton> = new Collection();

    async run() {
        loadListeners(this);
        loadButtons(this);
        return this.login(config.token).catch(console.error);
    }
}
