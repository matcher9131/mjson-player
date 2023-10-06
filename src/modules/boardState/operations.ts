import { useRecoilCallback } from "recoil";
import { boardStateAtom } from "./atoms";

export const useIncrementPositionIndex = () => {
    useRecoilCallback(
        ({ set }) =>
            () => {
                set(boardStateAtom, (prev) => {
                    // TODO: 実装
                    throw new Error("Not implemented");
                    return { ...prev };
                });
            },
        []
    );
};

export const useDecrementPositionIndex = () => {
    useRecoilCallback(
        ({ set }) =>
            () => {
                set(boardStateAtom, (prev) => {
                    // TODO: 実装
                    throw new Error("Not implemented");
                    return { ...prev };
                });
            },
        []
    );
};

export const useIncrementGameIndex = () => {
    useRecoilCallback(
        ({ set }) =>
            () => {
                set(boardStateAtom, (prev) => {
                    // TODO: 実装
                    throw new Error("Not implemented");
                    return { ...prev };
                });
            },
        []
    );
};

export const useDecrementGameIndex = () => {
    useRecoilCallback(
        ({ set }) =>
            () => {
                set(boardStateAtom, (prev) => {
                    // TODO: 実装
                    throw new Error("Not implemented");
                    return { ...prev };
                });
            },
        []
    );
};
