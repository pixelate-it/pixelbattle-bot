import { PixelClient } from "@structures/PixelClient";
import { GatewayIntentBits } from "discord.js";

const client = new PixelClient({ intents: [GatewayIntentBits.Guilds] });

client.run();
