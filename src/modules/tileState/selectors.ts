import { selectorFamily } from "recoil";
import { TileState } from "./types";
import { tileStateAtom } from "./atoms";
import { positionStateSelector } from "../positionState/selector";

// tileIdを指定してTileStateを得る（positionStateを参照して適切な局面のものを返す）
export const tileStateSelector = selectorFamily<TileState, number>({
    key: "tileStateSelector",
    get:
        (tileId) =>
        ({ get }) => {
            const position = get(positionStateSelector);
            return get(tileStateAtom({ tileId, ...position }));
        },
});
