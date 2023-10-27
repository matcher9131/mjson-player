import { selectorFamily } from "recoil";
import { TileStateTransition } from "./types";
import { PositionState } from "../positionState/types";
import { tileStateTransitionAtom } from "./atoms";

export const tileStateTransitionSelector = selectorFamily<ReadonlyArray<TileStateTransition>, PositionState>({
    key: "tileStateTransitionSelector",
    get:
        ({ gameIndex, positionIndex }: PositionState) =>
        ({ get }) =>
            gameIndex === "pre" || gameIndex === "post" ? [] : get(tileStateTransitionAtom)[gameIndex][positionIndex],
});
