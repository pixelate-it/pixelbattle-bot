import { PixelClient } from "@structures/PixelClient";
import { buttons } from "@buttons";

export function loadButtons(client: PixelClient) {
    for (const button of buttons) {
        client.buttons.set(button.id, button);

        console.log(`* [LOAD] Loaded "${button.id}" button`);
    }
}
