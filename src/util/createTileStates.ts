import {
    discardsOffsetX,
    discardsOffsetY,
    drawGapX,
    drawGapY,
    meldGapX,
    regularTileY,
    rotatedTileY,
    tileHeight,
    tileWidth,
} from "../consts";
import { MJson } from "../modules/mJson/types/mJson";
import { TileState, TileStateAtomType } from "../modules/tileState/types";
import { insertTo, removeFrom } from "./arrayExtensions";

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

// 'map'に捨て牌のTileStateを書き込む
function setDiscardsTilesState(side: Side, sideIndex: number, map: Map<number, TileState>) {
    const riichiRow = side.riichiIndex != null ? Math.floor(side.riichiIndex / 6) : -1;
    const riichiColumn = side.riichiIndex != null ? side.riichiIndex % 6 : -1;
    const adjustment = (i: number, j: number): number =>
        i == riichiRow && j >= riichiColumn ? tileHeight / 2 - tileWidth / 2 : 0;
    for (let discardIndex = 0; discardIndex < side.discards.length; ++discardIndex) {
        const i = Math.floor(discardIndex / 6);
        const j = discardIndex % 6;
        map.set(side.discards[discardIndex], {
            x: discardsOffsetX + j * tileWidth + tileWidth / 2 + adjustment(i, j),
            y: discardsOffsetY + i * tileHeight + tileHeight / 2,
            sideIndex,
            isRotated: discardIndex == side.riichiIndex,
        });
    }
}

// 'map'に全ての牌のTileStateを書き込む
function setAllTilesState(sides: readonly Side[], map: Map<number, TileState>) {
    for (let sideIndex = 0; sideIndex < sides.length; ++sideIndex) {
        // 手牌（ツモ牌以外）
        const side = sides[sideIndex];
        const sideWidth = getSideWidth(side);
        for (let j = 0; j < side.unrevealed.length; ++j) {
            map.set(side.unrevealed[j], {
                x: j * tileWidth + tileWidth / 2 - sideWidth / 2,
                y: regularTileY,
                sideIndex,
            });
        }

        // ツモ牌
        const drawTile = side.drawTile;
        if (drawTile != null) {
            map.set(drawTile, {
                x: getDrawX(side),
                y: regularTileY,
                sideIndex,
            });
        }

        // 捨て牌
        setDiscardsTilesState(side, sideIndex, map);

        // 鳴き牌
        let tileLeft = sideWidth + meldGapX;
        for (let meldIndex = 0; meldIndex < side.melds.length; ++meldIndex) {
            const meld = side.melds[meldIndex];
            for (let j = 0; j < meld.tiles.length; ++j) {
                if (j === meld.rotatedIndex) {
                    map.set(meld.tiles[j].tileId, {
                        x: tileLeft + tileHeight / 2,
                        y: rotatedTileY,
                        sideIndex,
                    });
                    if (meld.addedTileId) {
                        map.set(meld.addedTileId, {
                            x: tileLeft + tileHeight / 2,
                            y: rotatedTileY - tileWidth,
                            sideIndex,
                        });
                    }
                    tileLeft += tileHeight;
                } else {
                    map.set(meld.tiles[j].tileId, {
                        x: tileLeft + tileWidth / 2,
                        y: regularTileY,
                        sideIndex,
                    });
                    tileLeft += tileWidth;
                }
            }
            tileLeft += meldGapX;
        }
    }
}

export const createTileStates = (mJson: MJson): TileStateAtomType => {
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
        setAllTilesState(sides, map[0]);
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
            setAllTilesState(sides, map[positionIndex]);
        }
        return map;
    });
};
