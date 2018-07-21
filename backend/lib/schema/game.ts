import { LocaleID, COMMON_TABLES } from './common';
import * as knex from 'knex';
import { TableDefinition } from '../../types/schema';

type ID = number;

export class GameRow {
  constructor(
    public id: ID,
    public playerRange: number[],
    public title: LocaleID,
    public created_at: Date,
    public updated_at: Date,
  ) { };
};

export class GameRelationRow {
  constructor(
    public grid: number,
    public type: "expansion" | "accessary" | "",
    public targetID: ID,
    public sourceID: ID
  ) { };
};

const GAME: TableDefinition<GameRow> = {
  name: "GAME",
  schema: { id: "id", title: 'title', created_at: 'created_at', updated_at: 'updated_at', playerRange: 'playerRange' },
  builder: GameSchemaBuilder
};

const RELATION: TableDefinition<GameRelationRow> = {
  name: "RELATION",
  schema: { grid: "grid", targetID: 'targetID', sourceID: 'sourceID', type: 'type' },
  builder: GameRelationSchemaBuilder
};

export const GAME_TABLES: { GAME: TableDefinition<GameRow>, RELATION: TableDefinition<GameRelationRow> } = {
  GAME,
  RELATION,
};

function GameSchemaBuilder(table: knex.CreateTableBuilder) {
  table.integer(GAME.schema.id).notNullable().primary();
  table.increments(GAME.schema.id);

  table.foreign(GAME.schema.title).references(COMMON_TABLES.LOCALE.schema.localeID).inTable(COMMON_TABLES.LOCALE.name);
  table.timestamp(GAME.schema.created_at);
  table.timestamp(GAME.schema.updated_at);
  table.specificType(GAME.schema.playerRange, 'array');
};

function GameRelationSchemaBuilder(table: knex.CreateTableBuilder) {
  table.integer(RELATION.schema.grid).notNullable().primary();
  table.increments(RELATION.schema.grid);

  table.string(RELATION.schema.type);
  table.foreign(RELATION.schema.targetID).references(GAME.schema.id).inTable(GAME.name);
  table.foreign(RELATION.schema.sourceID).references(GAME.schema.id).inTable(GAME.name);
};
