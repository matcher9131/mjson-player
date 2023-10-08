export type Meld = {
    readonly tiles: readonly {
        readonly tileId: number;
        readonly isUnrevealed: boolean;
    }[];
    readonly rotatedIndex: number;
    readonly addedTile?: {
        readonly tileId: number;
        readonly positionIndex: number;
    };
};
