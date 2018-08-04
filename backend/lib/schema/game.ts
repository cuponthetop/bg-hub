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
  table.increments(GAME.schema.id).notNullable().primary();

  table.integer(GAME.schema.title);
  table.foreign(GAME.schema.title).references(COMMON_TABLES.LOCALE.schema.localeID).inTable(COMMON_TABLES.LOCALE.name).onDelete('SET NULL');
  table.timestamp(GAME.schema.created_at);
  table.timestamp(GAME.schema.updated_at);
  table.specificType(GAME.schema.playerRange, 'integer[]');
};

function GameRelationSchemaBuilder(table: knex.CreateTableBuilder) {
  table.increments(RELATION.schema.grid).notNullable().primary();

  table.string(RELATION.schema.type);
  table.integer(RELATION.schema.targetID);
  table.integer(RELATION.schema.sourceID);
  table.foreign(RELATION.schema.targetID).references(GAME.schema.id).inTable(GAME.name).onDelete('SET NULL');
  table.foreign(RELATION.schema.sourceID).references(GAME.schema.id).inTable(GAME.name).onDelete('SET NULL');
};
