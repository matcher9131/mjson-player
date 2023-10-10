import type { EventItem } from "./eventItem.ts";
import type { GameResult } from "./gameResult.ts";

export type Game = {
    readonly beginningScores: readonly number[];
    readonly round: number;
    readonly dealerKeepingCount: number;
    readonly bets: number;
    readonly dora: readonly number[];
    readonly hiddenDora?: readonly number[];
    readonly dealtTiles: readonly (readonly number[])[];
    readonly events: readonly EventItem[];
    readonly gameResults: readonly GameResult[];
};
