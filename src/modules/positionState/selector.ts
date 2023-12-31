import { selector, selectorFamily } from "recoil";
import { GameIndex, PositionState } from "./types";
import { positionStateAtom } from "./atoms";
import { getNextGameIndex, getPreviousGameIndex } from "./util";
import { mJsonSelector } from "../mJson/selectors";

export const positionStateSelector = selector<PositionState>({
    key: "positionStateSelector",
    get: ({ get }) => get(positionStateAtom),
});

export const positionLengthSelector = selectorFamily<number, GameIndex>({
    key: "positionLengthSelector",
    get:
        (gameIndex: GameIndex) =>
        ({ get }) =>
            gameIndex == "pre" || gameIndex == "post" ? 1 : get(mJsonSelector).games[gameIndex].events.length,
});

export const numGamesSelector = selector<number>({
    key: "numGamesSelector",
    get: ({ get }) => get(mJsonSelector).games.length,
});

export const nextPositionStateSelector = selector<PositionState>({
    key: "nextPositionStateSelector",
    get: ({ get }) => {
        const positionState = get(positionStateAtom);
        const { gameIndex, positionIndex } = positionState;
        const numGames = get(numGamesSelector);
        const nextGameIndex = getNextGameIndex(gameIndex, numGames);
        const positionLength = get(positionLengthSelector(gameIndex));

        if (positionIndex == positionLength - 1) {
            return {
                gameIndex: nextGameIndex,
                positionIndex: 0,
            };
        } else {
            return {
                gameIndex,
                positionIndex: positionIndex + 1,
            };
        }
    },
});

export const previousPositionStateSelector = selector<PositionState>({
    key: "previousPositionStateSelector",
    get: ({ get }) => {
        const positionState = get(positionStateAtom);
        const { gameIndex, positionIndex } = positionState;
        const numGames = get(numGamesSelector);
        const previousGameIndex = getPreviousGameIndex(gameIndex, numGames);
        const previousPositionLength = get(positionLengthSelector(previousGameIndex));

        if (positionIndex == 0) {
            return {
                gameIndex: previousGameIndex,
                positionIndex: previousPositionLength - 1,
            };
        } else {
            return {
                gameIndex,
                positionIndex: positionIndex - 1,
            };
        }
    },
});

export const nextGamePositionStateSelector = selector<PositionState>({
    key: "nextPositionStateSelector",
    get: ({ get }) => {
        const positionState = get(positionStateAtom);
        const { gameIndex } = positionState;
        const numGames = get(numGamesSelector);
        const nextGameIndex = getNextGameIndex(gameIndex, numGames);
        return {
            gameIndex: nextGameIndex,
            positionIndex: 0,
        };
    },
});

export const previousGamePositionStateSelector = selector<PositionState>({
    key: "previousGamePositionStateSelector",
    get: ({ get }) => {
        const positionState = get(positionStateAtom);
        const { gameIndex } = positionState;
        const numGames = get(numGamesSelector);
        const previousGameIndex = getPreviousGameIndex(gameIndex, numGames);
        return {
            gameIndex: previousGameIndex,
            positionIndex: 0,
        };
    },
});
