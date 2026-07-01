import type { Client, ClientEvents } from "discord.js";
import type { PixelClient } from "@structures/PixelClient";

type FixClient<T extends unknown[]> = {
    [K in keyof T]: T[K] extends Client<true> ? PixelClient : T[K];
};

export abstract class PixelListener<K extends keyof ClientEvents> {
    constructor(
        public readonly name: string,
        public readonly event: K,
        public readonly once: boolean = false
    ) {}

    public abstract run(
        ...args: FixClient<ClientEvents[K]>
    ): Promise<void> | void;
}
