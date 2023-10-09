import type { DrawKind } from "./drawKind.ts";
import type { YakuDoubles } from "./yakuDoubles.ts";

type GameResultBase = {
    readonly resultKind: "win" | "draw";
    readonly scoreIncrements: readonly number[];
};

export type GameResultWin = GameResultBase & {
    readonly resultKind: "win";
    readonly player: number;
    readonly from?: number;
    readonly pao?: number;
    readonly winScore: number;
    readonly points: number; // 符
    readonly yakuList: readonly YakuDoubles[];
};

export type GameResultDraw = GameResultBase & {
    readonly resultKind: "draw";
    readonly drawKind: DrawKind;
};

export type GameResult = GameResultWin | GameResultDraw;
