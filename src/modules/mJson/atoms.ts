import { atom } from "recoil";
import { MJson } from "../../types/mJson/mJson";

export const mJsonAtom = atom<MJson>({
    key: "mJsonAtom",
    default: {} as MJson, // NOT IMPLEMENTED
    effects: [
        ({ setSelf, trigger }) => {
            if (trigger == "get") {
                setSelf(/* */);
            }
        },
    ],
});
