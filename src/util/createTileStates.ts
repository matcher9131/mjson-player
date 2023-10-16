import { drawGapX, drawGapY, meldGapX, regularTileY, tileHeight, tileWidth } from "../consts";
import { MJson } from "../modules/mJson/types/mJson";
import { TileState, TileStateAtomType } from "../modules/tileState/types";
import { insertTo, lowerBound, removeFrom } from "./arrayExtensions";

type Meld = {
    readonly tiles: {
        readonly tileId: number;
        readonly isUnrevealed?: boolean;
    }[];
    readonly rotatedIndex?: number;
    addedTileId?: number;
};

type Side = {
    readonly unrevealed: number[];
    readonly melds: Meld[];
    readonly discards: number[];
    drawTile?: number; // ツモってから打牌するまでの間
    riichiIndex?: number;
};

function getMeldWidth(meld: Meld): number {
    return meld.tiles.length * tileWidth + (meld.rotatedIndex != null ? tileHeight - tileWidth : 0);
}

function getSideWidth(side: Side): number {
    // unrevealed.length = 13 or 14 => 14 * tileWidth + drawGapX
    // unrevealed.length = 10 or 11 => 11 * tileWidth + drawGapX
    const unrevealedWidth = (Math.floor((side.unrevealed.length + 2) / 3) * 3 - 1) * tileWidth + drawGapX;
    const meldsWidth = side.melds.reduce((sum, meld) => sum + meldGapX + getMeldWidth(meld), 0);
    return unrevealedWidth + meldsWidth;
}

function getDrawX(side: Side): number {
    return side.unrevealed.length * tileWidth + drawGapX + tileWidth / 2 - getSideWidth(side) / 2;
}

// 'map'に全ての牌のTileStateを書き込む
function getAllTilesState(sides: readonly Side[], map: Map<number, TileState>) {
    for (let sideIndex = 0; sideIndex < sides.length; ++sideIndex) {
        const sideWidth = getSideWidth(sides[sideIndex]);
        for (let j = 0; j < sides[sideIndex].unrevealed.length; ++j) {
            map.set(sides[sideIndex].unrevealed[j], {
                x: j * tileWidth + tileWidth / 2 - sideWidth / 2,
                y: regularTileY,
                sideIndex,
            });
        }

        const drawTile = sides[sideIndex].drawTile;
        if (drawTile != null) {
            map.set(drawTile, {
                x: getDrawX(sides[sideIndex]),
                y: regularTileY,
                sideIndex,
            });
        }

        // NOT IMPLEMENTED: 鳴き牌
    }
}

const createTileStates = (mJson: MJson): TileStateAtomType => {
    return mJson.games.map((game) => {
        const sides = game.dealtTiles.map(
            (dealt): Side => ({
                unrevealed: [...dealt],
                melds: [],
                discards: [],
            })
        );
        // map[positionIndex][tileId]
        const map: Map<number, TileState>[] = [];

        // 配牌
        map[0] = new Map();
        getAllTilesState(sides, map[0]);
        let positionIndex = 0;

        for (const event of game.events) {
            ++positionIndex;
            const sideIndex = event.p;
            const side = sides[sideIndex];
            switch (event.k) {
                case "t": // ツモ
                    {
                        const tileId = event.t;
                        side.drawTile = tileId;
                        // ツモるアニメーションのために一つ前の局面にツモ牌を仕込んでおく
                        map[positionIndex - 1].set(tileId, {
                            x: getDrawX(side),
                            y: regularTileY - drawGapY,
                            sideIndex,
                            isInvisible: true,
                        });
                    }
                    break;
                case "d": // 捨て
                    {
                        const tileId = event.t;
                        insertTo(side.unrevealed, side.drawTile!);
                        removeFrom(side.unrevealed, tileId);
                        side.drawTile = undefined;
                    }
                    break;
                case "c": // チー
                    {
                        for (const t of event.tiles) {
                            removeFrom(side.unrevealed, t);
                        }
                        const tiles = [event.t, ...event.tiles];
                        const rotatedIndex = 0;
                        side.melds.push({
                            tiles: tiles.map((t) => ({ tileId: t })),
                            rotatedIndex,
                        });
                        // 捨て牌からチーされた牌を消す
                        sides[(sideIndex + 3) % 4].discards.pop();
                    }
                    break;
                case "p": // ポン
                    {
                        const sideFrom = sides.findIndex((s) => s.discards.includes(event.t));
                        for (const t of event.tiles) {
                            removeFrom(side.unrevealed, t);
                        }
                        const tiles = [...event.tiles];
                        const rotatedIndex = ((): number => {
                            const relativeIndex = (sideFrom + 4 - sideIndex) % 4;
                            switch (relativeIndex) {
                                case 1:
                                    return 2;
                                case 2:
                                    return 1;
                                case 3:
                                    return 0;
                                default:
                                    throw new Error(
                                        `Assertion: 'relativeIndex' should be 1, 2, or 3 but actually ${relativeIndex}`
                                    );
                            }
                        })();
                        tiles.splice(rotatedIndex, 0, event.t);
                        side.melds.push({
                            tiles: tiles.map((t) => ({ tileId: t })),
                            rotatedIndex,
                        });
                        // 捨て牌からチーされた牌を消す
                        sides[sideFrom].discards.pop();
                    }
                    break;
                case "a": // 暗槓
                    {
                        insertTo(side.unrevealed, side.drawTile!);
                        side.drawTile = undefined;
                        for (const t of event.tiles) {
                            removeFrom(side.unrevealed, t);
                        }
                        side.melds.push({
                            tiles: event.tiles.map((t, i) => ({
                                tileId: t,
                                isUnrevealed: i == 1 || i == 2,
                            })),
                        });
                    }
                    break;
                case "m": // 明槓
                    {
                        const sideFrom = sides.findIndex((s) => s.discards.includes(event.t));
                        for (const t of event.tiles) {
                            removeFrom(side.unrevealed, t);
                        }
                        const tiles = [...event.tiles];
                        const rotatedIndex = ((): number => {
                            const relativeIndex = (sideFrom + 4 - sideIndex) % 4;
                            switch (relativeIndex) {
                                case 1:
                                    return 3;
                                case 2:
                                    return 1;
                                case 3:
                                    return 0;
                                default:
                                    throw new Error(`Assertion: relativeIndex == 1, 2, 3, actually ${relativeIndex}`);
                            }
                        })();
                        tiles.splice(rotatedIndex, 0, event.t);
                        side.melds.push({
                            tiles: tiles.map((t) => ({ tileId: t })),
                            rotatedIndex,
                        });
                        // 捨て牌からチーされた牌を消す
                        sides[sideFrom].discards.pop();
                    }
                    break;
                case "k": // 加槓
                    {
                        side.drawTile = undefined;
                        const meldIndex = side.melds.findIndex((meld) =>
                            meld.tiles.every((t) => t.tileId >> 2 === event.t >> 2)
                        );
                        if (meldIndex == -1) throw new Error("Assertion meldIndex >= 0, actually -1");
                        side.melds[meldIndex].addedTileId = event.t;
                    }
                    break;
            }
            // 全ての牌の位置を記録
            map[positionIndex] = new Map();
            getAllTilesState(sides, map[positionIndex]);
        }
    });
};
