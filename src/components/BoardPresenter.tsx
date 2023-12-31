import { boardOneSize } from "../consts";
import TileContainer from "./TileContainer";

const BoardPresenter = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`${-boardOneSize / 2} ${-boardOneSize / 2} ${boardOneSize} ${boardOneSize}`}
        >
            {new Array(136).fill(0).map((_, i) => (
                <TileContainer key={i} tileId={i} />
            ))}
        </svg>
    );
};

export default BoardPresenter;
