import { atomFamily } from "recoil";
import { TileState } from "./types";

export const tileStateAtom = atomFamily<TileState, number>({
    key: "tileStateAtoms",
    default: (tileId: number) => ({
        tileId,
        x: 0,
        y: 0,
        rotate: 0,
        isHidden: false,
        isFacedown: false,
    }),
});
