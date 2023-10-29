import React from "react";

type TilePresenterProps = {
    readonly tileId: string;
    readonly x: number;
    readonly y: number;
    readonly tileRotate: number;
    readonly sideRotate: number;
    readonly opacity: number;
};

const TilePresenter = React.memo(({ tileId, x, y, tileRotate, sideRotate, opacity }: TilePresenterProps) => {
    return (
        <use
            xlinkHref={`#${tileId}`}
            className="transition-all"
            transform={`rotate(${sideRotate}) translate(${x} ${y}) rotate(${tileRotate})`}
            opacity={opacity}
        />
    );
});

export default TilePresenter;
