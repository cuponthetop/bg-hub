import { LocaleItem, } from './common.model';

export type Position = "game designer" | "graphic designer";
export type GameID = number;

export class SimpleGame {
  constructor(
    public id: GameID,
    public playerRange: number[],
    public created_at: Date,
    public updated_at: Date,
  ) {

  };
};

export class Game extends SimpleGame {
  constructor(
    id: GameID,
    public relation: GameRelation[],
    playerRange: number[],
    public titleMsg: LocaleItem,
    created_at: Date,
    updated_at: Date,
  ) {
    super(id, playerRange, created_at, updated_at);
  };
};

interface GameRelation {
  grid: number,
  type: "expansion" | "accessary" | "";
  targetID: GameID,
  sourceID: GameID
};