import { selector } from "recoil";
import { mJsonAtom } from "./atoms";
import { MJson } from "../../types/mJson/mJson";

export const mJsonSelector = selector<MJson>({
    key: "mJsonSelector",
    get: ({ get }) => get(mJsonAtom),
});
