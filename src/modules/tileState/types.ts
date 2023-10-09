import { PositionState } from "../positionState/types";

export type TileState = {
    readonly tileId: number;
    readonly x: number;
    readonly y: number;
    readonly rotate: number;
    readonly isHidden: boolean;
    readonly isFacedown: boolean;
};

export type TileStateIdentifier = PositionState & {
    readonly tileId: number;
};
