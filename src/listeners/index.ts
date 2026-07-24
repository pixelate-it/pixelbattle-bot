import type { PixelListener } from "@structures/PixelListener";
import { ReadyListener } from "./ReadyListener";
import { ThreadCreateListener } from "./ThreadCreateListener";
import { ThreadUpdateListener } from "./ThreadUpdateListener";
import { ThreadDeleteListener } from "./ThreadDeleteListener";
import { InteractionCreateListener } from "./InteractionCreateListener";

export const listeners: PixelListener<any>[] = [
    new ReadyListener(),
    new ThreadCreateListener(),
    new ThreadUpdateListener(),
    new ThreadDeleteListener(),
    new InteractionCreateListener(),
];
