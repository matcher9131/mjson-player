import { TileState } from "../tileState/types";

export type TileStateTransition = {
    readonly tileId: number;
    readonly newState: TileState;
};
