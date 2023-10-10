import type { GameStat } from "./gameStat.ts";
import type { PlayerGameResult } from "./playerGameResult.ts";

export type MatchStat = {
    readonly matchId: number;
    readonly stats: {
        readonly player: PlayerGameResult;
        readonly gameStats: readonly GameStat[];
        readonly dealerKeepingCounts: readonly number[];
    }[];
};
