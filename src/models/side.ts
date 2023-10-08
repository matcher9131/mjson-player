import { Meld } from "./meld";

export type Side = {
    readonly playerIndex: number;
    readonly unrevealed: readonly number[];
    readonly melds: readonly Meld[];
    readonly discards: {
        readonly tileIds: readonly number[];
        readonly riichiIndex?: number;
    };
};
