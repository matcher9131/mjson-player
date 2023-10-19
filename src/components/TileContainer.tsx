import { useRecoilValue } from "recoil";
import { tileStateSelector } from "../modules/tileState/selectors";
import TilePresenter from "./TilePresenter";

type TileConatinerProps = {
    readonly tileId: number;
};
const TileContainer = ({ tileId }: TileConatinerProps) => {
    const tileState = useRecoilValue(tileStateSelector(tileId));
    const svgTileId = tileState.isFacedown
        ? "tile_facedown"
        : tileId == 16
        ? "tile4r"
        : tileId == 52
        ? "tile13r"
        : tileId == 88
        ? "tile22r"
        : `tile${tileId >> 2}`;
    return (
        <TilePresenter
            tileId={svgTileId}
            x={tileState.x}
            y={tileState.y}
            tileRotate={tileState.isRotated ? 90 : 0}
            sideRotate={-90 * tileState.sideIndex}
            opacity={tileState.isInvisible ? 0 : 1}
        />
    );
};

export default TileContainer;
