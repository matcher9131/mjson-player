import { atom } from "recoil";
import { MJson } from "../../types/mJson/mJson";
import sampleMJson from "../../data/sample1.json";

export const mJsonAtom = atom<MJson>({
    key: "mJsonAtom",
    default: {} as MJson,
    effects: [
        ({ setSelf, trigger }) => {
            if (trigger == "get") {
                setSelf(sampleMJson as MJson);
            }
        },
    ],
});
