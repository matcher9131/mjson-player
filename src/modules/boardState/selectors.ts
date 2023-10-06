import { selector } from "recoil";
import { BoardState } from "./types";
import { boardStateAtom } from "./atoms";

export const boardStateSelector = selector<BoardState>({
    key: "boardStateSelector",
    get: ({ get }) => ({ ...get(boardStateAtom) }),
});
