import { atom, atomFamily } from "recoil";
import { GameIndex, PositionState } from "./types";

export const positionStateAtom = atom<PositionState>({
    key: "positionStateAtom",
    default: {
        gameIndex: "pre",
        positionIndex: 0,
    },
});

export const positionLengthAtom = atomFamily<number, GameIndex>({
    key: "positionLengthAtom",
    default: () => 0, // NOT IMPLEMENTED
    // gameIndexが"pre", "post"に対するpositionLengthは1にすること！
});

export const numGamesAtom = atom<number>({
    key: "numGamesAtom",
    default: 0, // NOT IMPLEMENTED
});
