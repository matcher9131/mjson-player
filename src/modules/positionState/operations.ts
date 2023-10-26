import { useRecoilCallback, useRecoilValue } from "recoil";
import {
    nextGamePositionStateSelector,
    nextPositionStateSelector,
    previousGamePositionStateSelector,
    previousPositionStateSelector,
} from "./selectors";
import { positionStateAtom } from "./atoms";

export const useGoToNextPosition = () => {
    const newPositionState = useRecoilValue(nextPositionStateSelector);
    return useRecoilCallback(
        ({ set }) =>
            () => {
                set(positionStateAtom, newPositionState);
            },
        [newPositionState]
    );
};

export const useGoToPreviousPosition = () => {
    const newPositionState = useRecoilValue(previousPositionStateSelector);
    return useRecoilCallback(
        ({ set }) =>
            () => {
                set(positionStateAtom, newPositionState);
            },
        [newPositionState]
    );
};

export const useGoToNextGame = () => {
    const newPositionState = useRecoilValue(nextGamePositionStateSelector);
    return useRecoilCallback(
        ({ set }) =>
            () => {
                set(positionStateAtom, newPositionState);
            },
        [newPositionState]
    );
};

export const useGoToPreviousGame = () => {
    const newPositionState = useRecoilValue(previousGamePositionStateSelector);
    return useRecoilCallback(
        ({ set }) =>
            () => {
                set(positionStateAtom, newPositionState);
            },
        [newPositionState]
    );
};
