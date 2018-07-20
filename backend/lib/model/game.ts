import { LocaleID, COMMON_TABLES } from './common';
import * as knex from 'knex';

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


export enum GAME_TABLES {
  GAME = "GAME",
  RELATION = "RELATION",
};

export function GameSchemaBuilder(table: knex.CreateTableBuilder) {
  table.integer('id').notNullable().primary();
  table.increments('id');

  table.foreign('title').references('localeID').inTable(COMMON_TABLES.LOCALE);
  table.timestamp('created_at');
  table.timestamp('updated_at');
  table.specificType('playerRange', 'array');
};

export function GameRelationSchemaBuilder(table: knex.CreateTableBuilder) {
  table.integer('grid').notNullable().primary();
  table.increments('grid');

  table.foreign('targetID').references(GAME_TABLES.GAME).inTable('id');
  table.foreign('sourceID').references(GAME_TABLES.GAME).inTable('id');
};
