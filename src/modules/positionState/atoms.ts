import { atom } from "recoil";
import { PositionState } from "./types";

export const positionStateAtom = atom<PositionState>({
    key: "positionStateAtom",
    default: {
        gameIndex: "pre",
        positionIndex: 0,
    },
});
