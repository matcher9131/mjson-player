import { atom } from "recoil";
import { MJson } from "./types/mJson";

export const mJsonAtom = atom<MJson>({
    key: "mJsonAtom",
    default: {} as MJson, // NOT IMPLEMENTED
});
