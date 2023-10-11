import { atom } from "recoil";
import { TileState } from "./types";

// atom[gameIndex][positionIndex][tileId]
export const tileStateAtom = atom<readonly (readonly Map<number, TileState>[])[]>({
    key: "tileStateAtoms",
    default: [], // NOT IMPLEMENTED
});
