import { selectorFamily } from "recoil";
import { TileState } from "./types";
import { tileStateAtom } from "./atoms";

export const tileStateSelector = selectorFamily<TileState, number>({
    key: "tileStateSelector",
    get:
        (tileId) =>
        ({ get }) =>
            get(tileStateAtom(tileId)),
});
