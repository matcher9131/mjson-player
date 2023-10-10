import { useRecoilCallback, useRecoilValue } from "recoil";
import {
    nextGamePositionStateSelector,
    nextPositionStateSelector,
    previousGamePositionStateSelector,
    previousPositionStateSelector,
} from "./selector";
import { positionStateAtom } from "./atoms";

export const useGoToNextPosition = () => {
    const newPositionState = useRecoilValue(nextPositionStateSelector);
    useRecoilCallback(
        ({ set }) =>
            () => {
                set(positionStateAtom, newPositionState);
            },
        [newPositionState]
    );
};

export const useGoToPreviousPosition = () => {
    const newPositionState = useRecoilValue(previousPositionStateSelector);
    useRecoilCallback(
        ({ set }) =>
            () => {
                set(positionStateAtom, newPositionState);
            },
        [newPositionState]
    );
};

export const useGoToNextGame = () => {
    const newPositionState = useRecoilValue(nextGamePositionStateSelector);
    useRecoilCallback(
        ({ set }) =>
            () => {
                set(positionStateAtom, newPositionState);
            },
        [newPositionState]
    );
};

export const useGoToPreviousGame = () => {
    const newPositionState = useRecoilValue(previousGamePositionStateSelector);
    useRecoilCallback(
        ({ set }) =>
            () => {
                set(positionStateAtom, newPositionState);
            },
        [newPositionState]
    );
};
