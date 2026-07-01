import type { PixelListener } from "@structures/PixelListener";
import { ReadyListener } from "./ReadyListener";

export const listeners: PixelListener<any>[] = [new ReadyListener()];
