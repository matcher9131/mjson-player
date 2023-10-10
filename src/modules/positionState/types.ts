export type GameIndex = number | "pre" | "post";

export type PositionState = {
    readonly gameIndex: GameIndex;
    readonly positionIndex: number;
};
