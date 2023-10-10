import { GameIndex } from "./types";

export const getNextGameIndex = (gameIndex: GameIndex, numGames: number): GameIndex => {
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
};

export const getPreviousGameIndex = (gameIndex: GameIndex, numGames: number): GameIndex => {
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
};
