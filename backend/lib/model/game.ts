import { LocaleID, LocaleItem, } from './common';

export type Position = "game designer" | "graphic designer";
export type GameID = number;

export class SimpleGame {
  constructor(
    public id: GameID,
    public playerRange: number[],
    public title: LocaleID,
    public created_at: Date,
    public updated_at: Date,
    public box: { width: number, height: number, depth: number },
    public settingSize: { width: number, height: number }
  ) {

  };
};

export class Game extends SimpleGame {
  constructor(
    id: GameID,
    public relation: GameRelation[],
    playerRange: number[],
    title: LocaleID,
    public titleMsg: LocaleItem,
    created_at: Date,
    updated_at: Date,
    box: { width: number, height: number, depth: number },
    settingSize: { width: number, height: number }
  ) {
    super(id, playerRange, title, created_at, updated_at, box, settingSize);
  };
};

interface GameRelation {
  grid: number,
  type: "expansion" | "accessary" | "";
  targetID: GameID,
  sourceID: GameID
};