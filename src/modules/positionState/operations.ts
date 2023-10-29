import { useRecoilCallback } from "recoil";
import { numGamesSelector, numPositionsSelector, positionStateSelector } from "./selectors";
import { positionStateAtom } from "./atoms";
import { GameIndex } from "./types";

function getNextGameIndex(gameIndex: GameIndex, numGames: number): GameIndex {
    switch (gameIndex) {
        case "pre":
            return 0;
        case "post":
            return "pre";
        case numGames - 1:
            return "post";
        default:
            return gameIndex + 1;
    }
}

function getPreviousGameIndex(gameIndex: GameIndex, numGames: number): GameIndex {
    switch (gameIndex) {
        case "pre":
            return "post";
        case "post":
            return numGames - 1;
        case 0:
            return "pre";
        default:
            return gameIndex - 1;
    }
}

export const useGoToNextPosition = () =>
    useRecoilCallback(
        ({ set, snapshot }) =>
            () => {
                const { gameIndex, positionIndex } = snapshot.getLoadable(positionStateSelector).getValue();
                const numGames = snapshot.getLoadable(numGamesSelector).getValue();
                const numPositions = snapshot.getLoadable(numPositionsSelector(gameIndex)).getValue();
                const newPosition =
                    positionIndex === numPositions - 1
                        ? { gameIndex: getNextGameIndex(gameIndex, numGames), positionIndex: 0 }
                        : { gameIndex, positionIndex: positionIndex + 1 };
                set(positionStateAtom, () => newPosition);
            },
        []
    );

export const useGoToPreviousPosition = () =>
    useRecoilCallback(
        ({ set, snapshot }) =>
            () => {
                const { gameIndex, positionIndex } = snapshot.getLoadable(positionStateSelector).getValue();
                const numGames = snapshot.getLoadable(numGamesSelector).getValue();
                const previousNumPositions = snapshot
                    .getLoadable(numPositionsSelector(getPreviousGameIndex(gameIndex, numGames)))
                    .getValue();
                const newPosition =
                    positionIndex === 0
                        ? { gameIndex: getPreviousGameIndex(gameIndex, numGames), positionIndex: previousNumPositions }
                        : { gameIndex, positionIndex: positionIndex - 1 };
                set(positionStateAtom, () => newPosition);
            },
        []
    );

export const useGoToNextGame = () =>
    useRecoilCallback(
        ({ set, snapshot }) =>
            () => {
                const { gameIndex } = snapshot.getLoadable(positionStateSelector).getValue();
                const numGames = snapshot.getLoadable(numGamesSelector).getValue();
                const newPosition = { gameIndex: getNextGameIndex(gameIndex, numGames), positionIndex: 0 };
                set(positionStateAtom, () => newPosition);
            },
        []
    );

export const useGoToPreviousGame = () =>
    useRecoilCallback(
        ({ set, snapshot }) =>
            () => {
                const { gameIndex, positionIndex } = snapshot.getLoadable(positionStateSelector).getValue();
                const numGames = snapshot.getLoadable(numGamesSelector).getValue();
                // positionIndexが0のときは前の局の先頭へ、そうでなければ今の局の先頭へ
                const newPosition = {
                    gameIndex: positionIndex == 0 ? getPreviousGameIndex(gameIndex, numGames) : gameIndex,
                    positionIndex: 0,
                };
                set(positionStateAtom, () => newPosition);
            },
        []
    );
