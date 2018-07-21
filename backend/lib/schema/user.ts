import * as knex from 'knex';
import { TableDefinition } from '../../types/schema';
import { GAME_TABLES } from './game';

export class UserRow {
  constructor(
    public id: number,
    public authID: string,
    public username: string,
    public email: string,
    public created_at: Date,
    public updated_at: Date,
  ) { };
}

export interface GameListRow {
  game: number,
  user: number
  type: "own"
};

export interface HistoryRow {
  id: number,
  game: number,
  user: number,
  from: Date,
  to: Date,
  location: LocationRow,
};

export interface ResultRow {
  id: number,
  history: number,
  player: number,
  score: number,
};

export interface GroupRow {
  id: number
  name: string,
  member: number[]
};

export interface LocationRow {
  x: number, y: number, z: number
};


const USER: TableDefinition<UserRow> = {
  name: "USER",
  schema: { id: "id", authID: "authID", username: "username", email: "email", created_at: "created_at", updated_at: "updated_at" },
  builder: UserSchemaBuilder
};

const GAME_LIST: TableDefinition<GameListRow> = {
  name: "GAME_LIST",
  schema: { game: "game", user: 'user', type: 'type' },
  builder: GameListSchemaBuilder
};

const HISTORY: TableDefinition<HistoryRow> = {
  name: "History",
  schema: { id: "id", game: "game", user: "user", from: "from", to: "to", location: "location" },
  builder: HistorySchemaBuilder
};

const RESULT: TableDefinition<ResultRow> = {
  name: "RESULT",
  schema: { id: "id", history: "history", player: "player", score: "score" },
  builder: ResultSchemaBuilder
};

const GROUP: TableDefinition<GroupRow> = {
  name: "GROUP",
  schema: { id: "id", name: "name", member: "member" },
  builder: GroupSchemaBuilder
};

export const USER_TABLES: {
  USER: TableDefinition<UserRow>,
  GAME_LIST: TableDefinition<GameListRow>,
  HISTORY: TableDefinition<HistoryRow>,
  RESULT: TableDefinition<ResultRow>,
  GROUP: TableDefinition<GroupRow>,
} = { USER, GAME_LIST, HISTORY, RESULT, GROUP, };

function UserSchemaBuilder(table: knex.CreateTableBuilder) {
  table.integer(USER.schema.id).notNullable().primary();
  table.increments(USER.schema.id);

  table.string(USER.schema.authID);

  table.string(USER.schema.username);
  table.string(USER.schema.email);

  table.timestamp(USER.schema.created_at);
  table.timestamp(USER.schema.updated_at);

};

function GameListSchemaBuilder(table: knex.CreateTableBuilder) {
  table.foreign(GAME_LIST.schema.user).references(USER.schema.id).inTable(USER.name);
  table.foreign(GAME_LIST.schema.game).references(GAME_TABLES.GAME.schema.id).inTable(GAME_TABLES.GAME.name);
  table.string(GAME_LIST.schema.type);
  table.primary([GAME_LIST.schema.user, GAME_LIST.schema.game]);
};

function HistorySchemaBuilder(table: knex.CreateTableBuilder) {
  table.integer(HISTORY.schema.id).notNullable().primary();
  table.increments(HISTORY.schema.id);

  table.foreign(HISTORY.schema.user).references(USER.schema.id).inTable(USER.name);
  table.foreign(HISTORY.schema.game).references(GAME_TABLES.GAME.schema.id).inTable(GAME_TABLES.GAME.name);

  table.timestamp(HISTORY.schema.from);
  table.timestamp(HISTORY.schema.to);

  // table.specificType(HISTORY.schema.location, 'GIS');
}

function ResultSchemaBuilder(table: knex.CreateTableBuilder) {
  table.integer(RESULT.schema.id).notNullable().primary();
  table.increments(RESULT.schema.id);

  table.foreign(RESULT.schema.history).references(HISTORY.schema.id).inTable(HISTORY.name);
  table.foreign(RESULT.schema.player).references(USER.schema.id).inTable(USER.name);
  table.decimal(RESULT.schema.score);
};

function GroupSchemaBuilder(table: knex.CreateTableBuilder) {
  table.integer(GROUP.schema.id).notNullable().primary();
  table.increments(GROUP.schema.id);

  table.string(GROUP.schema.name);
  table.specificType(GROUP.schema.member, 'array').references(USER.schema.id).inTable(USER.name);
};
