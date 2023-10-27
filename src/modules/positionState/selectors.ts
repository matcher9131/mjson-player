import { selector, selectorFamily } from "recoil";
import { GameIndex, PositionState } from "./types";
import { positionStateAtom } from "./atoms";
import { mJsonSelector } from "../mJson/selectors";
import { tileStateTransitionAtom } from "../tileStateTransition/atoms";

export const positionStateSelector = selector<PositionState>({
    key: "positionStateSelector",
    get: ({ get }) => get(positionStateAtom),
});

export const numGamesSelector = selector<number>({
    key: "numGamesSelector",
    get: ({ get }) => get(mJsonSelector).games.length,
});

export const numPositionsSelector = selectorFamily<number, GameIndex>({
    key: "numPositionsSelector",
    get:
        (gameIndex: GameIndex) =>
        ({ get }) =>
            gameIndex === "pre" || gameIndex === "post" ? 1 : get(tileStateTransitionAtom)[gameIndex].length,
});
