const drawKinds = ["荒牌平局", "九種九牌", "四家立直", "三家和", "四開槓", "四風連打", "流し満貫"] as const;

export type DrawKind = (typeof drawKinds)[number];
