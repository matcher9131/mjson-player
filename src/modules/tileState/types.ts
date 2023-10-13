export type TileState = {
    readonly x: number;
    readonly y: number;
    readonly sideIndex: number;
    readonly isRotated?: boolean;
    readonly isInvisible?: boolean;
    readonly isFacedown?: boolean;
};

// atom[gameIndex][positionIndex][tileId]
export type TileStateAtomType = readonly (readonly Map<number, TileState>[])[];
