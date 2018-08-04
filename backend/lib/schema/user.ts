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

export class GameListRow {
  constructor(
    public game: number,
    public user: number,
    public type: "own"
  ) { }
};

export class HistoryRow {
  constructor(
    public id: number,
    public game: number,
    public user: number,
    public from: Date,
    public to: Date,
    public location: LocationRow,
  ) { }
};

export class ResultRow {
  constructor(
    public id: number,
    public history: number,
    public player: number,
    public score: number,
  ) { }
};

export class GroupRow {
  constructor(
    public id: number,
    public name: string
  ) { }
};

export class GroupMemberRow {
  constructor(
    public id: number,
    public member: number
  ) { }
};

export class LocationRow {
  constructor(
    public x: number,
    public y: number,
    public z: number
  ) { }
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
  name: "HISTORY",
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
  schema: { id: "id", name: "name" },
  builder: GroupSchemaBuilder
};

const GROUP_MEMBER: TableDefinition<GroupMemberRow> = {
  name: "GROUP_MEMBER",
  schema: { id: "id", member: "member" },
  builder: GroupMemberSchemaBuilder
};

export const USER_TABLES: {
  USER: TableDefinition<UserRow>,
  GAME_LIST: TableDefinition<GameListRow>,
  HISTORY: TableDefinition<HistoryRow>,
  RESULT: TableDefinition<ResultRow>,
  GROUP: TableDefinition<GroupRow>,
  GROUP_MEMBER: TableDefinition<GroupMemberRow>,
} = { USER, GAME_LIST, HISTORY, RESULT, GROUP, GROUP_MEMBER };

function UserSchemaBuilder(table: knex.CreateTableBuilder) {
  table.increments(USER.schema.id).notNullable().primary();

  table.string(USER.schema.authID);

  table.string(USER.schema.username);
  table.string(USER.schema.email);

  table.timestamp(USER.schema.created_at);
  table.timestamp(USER.schema.updated_at);

};

function GameListSchemaBuilder(table: knex.CreateTableBuilder) {

  table.integer(GAME_LIST.schema.user);
  table.integer(GAME_LIST.schema.game);

  table.foreign(GAME_LIST.schema.user).references(USER.schema.id).inTable(USER.name).onDelete('SET NULL');
  table.foreign(GAME_LIST.schema.game).references(GAME_TABLES.GAME.schema.id).inTable(GAME_TABLES.GAME.name).onDelete('SET NULL');

  table.string(GAME_LIST.schema.type);
  table.primary([GAME_LIST.schema.user, GAME_LIST.schema.game]);
};

function HistorySchemaBuilder(table: knex.CreateTableBuilder) {
  table.increments(HISTORY.schema.id).notNullable().primary();

  table.integer(HISTORY.schema.user);
  table.integer(HISTORY.schema.game);

  table.foreign(HISTORY.schema.user).references(USER.schema.id).inTable(USER.name).onDelete('SET NULL');
  table.foreign(HISTORY.schema.game).references(GAME_TABLES.GAME.schema.id).inTable(GAME_TABLES.GAME.name).onDelete('SET NULL');

  table.timestamp(HISTORY.schema.from);
  table.timestamp(HISTORY.schema.to);

  // table.specificType(HISTORY.schema.location, 'GIS');
}

function ResultSchemaBuilder(table: knex.CreateTableBuilder) {
  table.increments(RESULT.schema.id).notNullable().primary();

  table.integer(RESULT.schema.history);
  table.integer(RESULT.schema.player);

  table.foreign(RESULT.schema.history).references(HISTORY.schema.id).inTable(HISTORY.name).onDelete('SET NULL');
  table.foreign(RESULT.schema.player).references(USER.schema.id).inTable(USER.name).onDelete('SET NULL');
  table.decimal(RESULT.schema.score);
};

function GroupSchemaBuilder(table: knex.CreateTableBuilder) {
  table.increments(GROUP.schema.id).notNullable().primary();
  table.string(GROUP.schema.name);
};

function GroupMemberSchemaBuilder(table: knex.CreateTableBuilder) {
  table.integer(GROUP_MEMBER.schema.id);
  table.integer(GROUP_MEMBER.schema.member);
  table.foreign(GROUP_MEMBER.schema.id).references(GROUP.schema.id).inTable(GROUP.name);
  table.foreign(GROUP_MEMBER.schema.member).references(USER.schema.id).inTable(USER.name);

  table.primary([GROUP_MEMBER.schema.id, GROUP_MEMBER.schema.member]);
};
