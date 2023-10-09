import { selector } from "recoil";
import { PositionState } from "./types";
import { positionStateAtom } from "./atoms";

export const positionStateSelector = selector<PositionState>({
    key: "positionStateSelector",
    get: ({ get }) => ({ ...get(positionStateAtom) }),
});
