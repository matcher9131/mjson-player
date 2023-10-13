import { atom } from "recoil";
import { TileStateAtomType } from "./types";

// atom[gameIndex][positionIndex][tileId]
export const tileStateAtom = atom<TileStateAtomType>({
    key: "tileStateAtoms",
    default: [], // NOT IMPLEMENTED
});
