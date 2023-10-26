import { atom } from "recoil";
import { TileStateTransition } from "./types";
import { mJsonSelector } from "../mJson/selectors";
import { createTileStateTransitions } from "./initialize";

// tileStateTransitionAtom[gameIndex][positionIndex][]
export const tileStateTransitionAtom = atom<ReadonlyArray<ReadonlyArray<ReadonlyArray<TileStateTransition>>>>({
    key: "tileStateTransitionAtom",
    effects: [
        ({ setSelf, trigger, getLoadable }) => {
            if (trigger == "get") {
                const mJson = getLoadable(mJsonSelector).getValue();
                setSelf(createTileStateTransitions(mJson));
            }
        },
    ],
});
