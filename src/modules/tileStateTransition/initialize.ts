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
} from "../../consts";
import { MJson } from "../../types/mJson/mJson";
import { TileState, getDefaultTileState } from "../tileState/types";
import { insertTo, removeFrom } from "../../util/arrayExtensions";
import { TileStateTransition } from "./types";

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

function getUnrevealedWidth(side: Side): number {
    // unrevealed.length = 13 or 14 => 14 * tileWidth + drawGapX
    // unrevealed.length = 10 or 11 => 11 * tileWidth + drawGapX
    return (Math.floor((side.unrevealed.length + 2) / 3) * 3 - 1) * tileWidth + drawGapX;
}

function getMeldWidth(meld: Meld): number {
    return meld.tiles.length * tileWidth + (meld.rotatedIndex != null ? tileHeight - tileWidth : 0);
}

function getSideWidth(side: Side): number {
    const unrevealedWidth = getUnrevealedWidth(side);
    const meldsWidth = side.melds.reduce((sum, meld) => sum + meldGapX + getMeldWidth(meld), 0);
    return unrevealedWidth + meldsWidth;
}

function getDrawX(side: Side): number {
    return getUnrevealedWidth(side) - tileWidth / 2 - getSideWidth(side) / 2;
}

function isSameState(state1: TileState, state2: TileState): boolean {
    return (
        state1.x === state2.x &&
        state1.y === state2.y &&
        state1.sideIndex === state2.sideIndex &&
        state1.isRotated == state2.isRotated &&
        state1.isInvisible == state2.isInvisible
    );
}

// 'states'に捨て牌のTileStateを書き込む
function setDiscardsTilesState(states: TileState[], side: Side, sideIndex: number): void {
    const riichiRow = side.riichiIndex != null ? Math.min(2, Math.floor(side.riichiIndex / 6)) : -1;
    const riichiColumn = side.riichiIndex != null ? side.riichiIndex - 6 * riichiRow : -1;
    const adjustment = (i: number, j: number): number => {
        if (i == riichiRow) {
            if (j == riichiColumn) return tileHeight / 2 - tileWidth / 2;
            else if (j > riichiColumn) return tileHeight - tileWidth;
        }
        return 0;
    };
    for (let discardIndex = 0; discardIndex < side.discards.length; ++discardIndex) {
        const i = Math.min(2, Math.floor(discardIndex / 6));
        const j = discardIndex - 6 * i;
        states[side.discards[discardIndex]] = {
            x: discardsOffsetX + j * tileWidth + adjustment(i, j),
            y: discardsOffsetY + i * tileHeight,
            sideIndex,
            isRotated: discardIndex == side.riichiIndex,
        };
    }
}

function getAllTilesState(sides: readonly Side[]): TileState[] {
    const states = new Array(136).fill(0).map(() => getDefaultTileState());
    for (let sideIndex = 0; sideIndex < sides.length; ++sideIndex) {
        const side = sides[sideIndex];
        // 手牌（ツモ牌以外）
        const sideWidth = getSideWidth(side);
        for (let j = 0; j < side.unrevealed.length; ++j) {
            states[side.unrevealed[j]] = {
                x: j * tileWidth + tileWidth / 2 - sideWidth / 2,
                y: regularTileY,
                sideIndex,
            };
        }

        // ツモ牌
        const drawTile = side.drawTile;
        if (drawTile != null) {
            states[drawTile] = {
                x: getDrawX(side),
                y: regularTileY,
                sideIndex,
            };
        }

        // 捨て牌
        setDiscardsTilesState(states, side, sideIndex);

        // 鳴き牌
        let tileLeft = getUnrevealedWidth(side) + meldGapX - sideWidth / 2;
        for (let meldIndex = 0; meldIndex < side.melds.length; ++meldIndex) {
            const meld = side.melds[meldIndex];
            for (let j = 0; j < meld.tiles.length; ++j) {
                if (j === meld.rotatedIndex) {
                    states[meld.tiles[j].tileId] = {
                        x: tileLeft + tileHeight / 2,
                        y: rotatedTileY,
                        sideIndex,
                        isRotated: true,
                    };
                    if (meld.addedTileId) {
                        states[meld.addedTileId] = {
                            x: tileLeft + tileHeight / 2,
                            y: rotatedTileY - tileWidth,
                            sideIndex,
                        };
                    }
                    tileLeft += tileHeight;
                } else {
                    states[meld.tiles[j].tileId] = {
                        x: tileLeft + tileWidth / 2,
                        y: regularTileY,
                        sideIndex,
                    };
                    tileLeft += tileWidth;
                }
            }
            tileLeft += meldGapX;
        }
    }
    return states;
}

export const createTileStateTransitions = (mJson: MJson): TileStateTransition[][][] => {
    return mJson.games.map((game) => {
        const sides = game.dealtTiles.map(
            (dealt): Side => ({
                unrevealed: [...dealt],
                melds: [],
                discards: [],
            })
        );

        // states[tileId]
        let prevStates: TileState[] = getAllTilesState(sides);
        // transitions[positionIndex][]
        const transitions: TileStateTransition[][] = [prevStates.map((newState, tileId) => ({ tileId, newState }))];

        for (const event of game.events) {
            const sideIndex = event.p;
            const side = sides[sideIndex];
            switch (event.k) {
                case "t": // ツモ
                    {
                        const tileId = event.t;
                        side.drawTile = tileId;
                        // ツモるアニメーションのために一つ前の局面にツモ牌を仕込んでおく
                        transitions[transitions.length - 1].push({
                            tileId,
                            newState: {
                                x: getDrawX(side),
                                y: regularTileY - drawGapY,
                                sideIndex,
                                isInvisible: true,
                            },
                        });
                    }
                    break;
                case "d": // 捨て
                    {
                        const tileId = event.t;
                        insertTo(side.unrevealed, side.drawTile!);
                        removeFrom(side.unrevealed, tileId);
                        side.drawTile = undefined;
                        side.discards.push(event.t);
                        if (event.isRiichi) side.riichiIndex = side.discards.length - 1;
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
                        if (sideFrom < 0) throw new Error(`Assertion: 'sideFrom' >= 0, actual: ${sideFrom}`);
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
            const newStates = getAllTilesState(sides);
            const newTransitions: TileStateTransition[] = [];
            for (let tileId = 0; tileId < 136; ++tileId) {
                if (!isSameState(prevStates[tileId], newStates[tileId])) {
                    newTransitions.push({ tileId, newState: newStates[tileId] });
                }
            }
            transitions.push(newTransitions);
            prevStates = newStates;
        }
        return transitions;
    });
};
