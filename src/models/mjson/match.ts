import type { PlayerGameResult } from "./playerGameResult.ts";
import type { Game } from "./game.ts";

export type Match = {
    readonly id: number;
    readonly players: readonly PlayerGameResult[];
    readonly games: readonly Game[];
};
