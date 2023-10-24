import type { YakuDoubles } from "./yakuDoubles.ts";

export type GameStat = {
    readonly isDealer: boolean;
    readonly dealtShantenCount: number;
    readonly dealtDoraCount: number;
    readonly melds: boolean;
    readonly riichiStat?: RiichiStat;
    readonly winStat?: WinGameStat;
    readonly lossStats?: readonly LossGameStat[];
};

export type WinGameStat = {
    readonly winScore: number;
    readonly isSelfDraw: boolean;
    readonly winRound: number;
    readonly yakuList: readonly YakuDoubles[];
};

export type LossGameStat = {
    readonly scoresLoss: number;
    readonly isFeeding: boolean;
};

export type RiichiStat = {
    readonly riichiRound: number;
    readonly isPreemptive: boolean;
    readonly isBadFormWaiting: boolean;
    readonly waitingKind?: "furiten" | "trick";
};
