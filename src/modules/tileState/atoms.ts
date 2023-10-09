import { atomFamily } from "recoil";
import { TileState, TileStateIdentifier } from "./types";

export const tileStateAtom = atomFamily<TileState, TileStateIdentifier>({
    key: "tileStateAtoms",
    default: () => {
        throw new Error("Not implemented");
        return {};
    },
});
