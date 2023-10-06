export type BoardState = {
    readonly gameIndex: number | "pre" | "post";
    readonly positionIndex: number;
    readonly rotate: number;
};
