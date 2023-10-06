import { atom } from "recoil";
import { BoardState } from "./types";

export const boardStateAtom = atom<BoardState>({
    key: "boardStateAtom",
    default: {
        gameIndex: "pre",
        positionIndex: 0,
        rotate: 0,
    },
});
