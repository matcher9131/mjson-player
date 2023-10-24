import { atom } from "recoil";
import { TileStateAtomType } from "./types";
import { mJsonSelector } from "../mJson/selectors";
import { createTileStates } from "./initialize";

// atom[gameIndex][positionIndex][tileId]
export const tileStateAtom = atom<TileStateAtomType>({
    key: "tileStateAtoms",
    default: [],
    effects: [
        ({ setSelf, trigger, getLoadable }) => {
            if (trigger == "get") {
                const mJson = getLoadable(mJsonSelector).getValue();
                setSelf(createTileStates(mJson));
            }
        },
    ],
});
