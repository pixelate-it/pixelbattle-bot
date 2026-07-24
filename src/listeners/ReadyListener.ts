import { config } from "@config";
import { PixelClient } from "@structures/PixelClient";
import { PixelListener } from "@structures/PixelListener";
import { setupIdeasForum } from "@helpers/ideasSetup";
import { ActivityType } from "discord.js";

interface Info {
    name: string;
    ended: boolean;
    cooldown: number;
    online: number;
    canvas: {
        width: number;
        height: number;
    };
}

async function buildOnline() {
    const errored = "API status";

    try {
        const response = await fetch(new URL("/game", config.api).href);
        if (!response.ok) return errored;

        const data = (await response.json()) as Info;
        return `online - ${data.online}`;
    } catch {
        return errored;
    }
}

export class ReadyListener extends PixelListener<"clientReady"> {
    constructor() {
        super("ReadyListener", "clientReady", true);
    }

    async run(client: PixelClient) {
        const presence = async () => {
            const status = await buildOnline();
            client.user?.setPresence({
                status: "idle",
                activities: [{ name: status, type: ActivityType.Watching }],
            });
        };
        await presence();
        setInterval(presence, 30000);

        await setupIdeasForum(client).catch((error) =>
            console.error("* [IDEAS] Setup failed:", error),
        );

        console.log("* [ROOT] Bot started");
    }
}
