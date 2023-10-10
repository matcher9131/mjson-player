import { selector } from "recoil";
import { MJson } from "./types/mJson";
import { mJsonAtom } from "./atoms";

export const mJsonSelector = selector<MJson>({
    key: "mJsonSelector",
    get: ({ get }) => get(mJsonAtom),
});
