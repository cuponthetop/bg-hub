import { LocaleID } from './common';

export type Position = "game designer" | "graphic designer";
export type GameID = number;

export class SimpleGame {
  constructor(
    public id: GameID,
    public playerRange: number[],
    public title: LocaleID,
    public created_at: Date,
    public updated_at: Date,
  ) {

  };
};

export class Game extends SimpleGame {
  constructor(
    id: GameID,
    public parameter: GameParameter[],
    public relation: GameRelation[],
    playerRange: number[],
    title: LocaleID,
    created_at: Date,
    updated_at: Date,
  ) {
    super(id, playerRange, title, created_at, updated_at);
  };
};

export interface GameRelation {
  type: "expansion" | "accessary" | "";
  targetID: GameID,
  sourceID: GameID
};

export interface GameParameter {
  name: LocaleID,
  point: number
};