import { useRecoilCallback } from "recoil";
import { tileStateTransitionSelector } from "../tileStateTransition/selectors";
import { positionStateSelector } from "../positionState/selectors";
import { tileStateAtom } from "./atoms";

export const useUpdateTileState = () =>
    useRecoilCallback(
        ({ set, snapshot }) =>
            () => {
                const positionState = snapshot.getLoadable(positionStateSelector).getValue();
                const transitions = snapshot.getLoadable(tileStateTransitionSelector(positionState)).getValue();
                for (const { tileId, newState } of transitions) {
                    set(tileStateAtom(tileId), newState);
                }
            },
        []
    );
