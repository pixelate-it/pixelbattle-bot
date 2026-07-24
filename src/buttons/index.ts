import type { PixelButton } from "@structures/PixelButton";
import { IdeaCancelButton } from "./IdeaCancelButton";
import { IdeaKeepButton } from "./IdeaKeepButton";
import { IdeaStatusButton } from "./IdeaStatusButton";
import { IdeaCloseButton } from "./IdeaCloseButton";

export const buttons: PixelButton[] = [
    new IdeaCancelButton(),
    new IdeaKeepButton(),
    new IdeaStatusButton(),
    new IdeaCloseButton(),
];
