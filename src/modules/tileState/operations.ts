import { useRecoilCallback } from "recoil";
import { tileStateAtom } from "./atoms";

export const useSetTileCoordinate = () => {
    useRecoilCallback(
        ({ set }) =>
            (tileId: number, x: number, y: number, rotate: number) => {
                set(tileStateAtom(tileId), (prev) => ({
                    ...prev,
                    x,
                    y,
                    rotate,
                }));
            },
        []
    );
};
