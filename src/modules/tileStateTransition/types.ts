import { TileState } from "../tileState/types";

export type TileStateTransition = {
    readonly kind: "forward" | "backward";
    readonly tileId: number;
    readonly newState: TileState;
};
