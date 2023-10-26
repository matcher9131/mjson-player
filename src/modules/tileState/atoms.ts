import { atomFamily } from "recoil";
import { TileState, getDefaultTileState } from "./types";

export const tileStateAtom = atomFamily<TileState, number>({
    key: "tileStateAtoms",
    default: () => getDefaultTileState(),
});
