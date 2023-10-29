export type TileState = {
    readonly x: number;
    readonly y: number;
    readonly sideIndex: number;
    readonly isRotated?: boolean;
    readonly isInvisible?: boolean;
    readonly isFacedown?: boolean;
};

export const getDefaultTileState = (): TileState => ({
    x: 0,
    y: 0,
    sideIndex: 0,
    isInvisible: true,
});
