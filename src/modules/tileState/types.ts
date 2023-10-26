export type TileState = {
    readonly x: number;
    readonly y: number;
    readonly sideIndex: number;
    readonly isRotated?: boolean;
    readonly isInvisible?: boolean;
    readonly isFacedown?: boolean;
};

// atom[gameIndex][positionIndex][tileId]
// export type TileStateAtomType = readonly (readonly Map<number, TileState>[])[];

export const getDefaultTileState = (): TileState => ({
    x: 0,
    y: 0,
    sideIndex: 0,
    isInvisible: true,
});
