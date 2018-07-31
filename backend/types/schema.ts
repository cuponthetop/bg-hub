import * as knex from 'knex';

export type CreateTableFunc = (table: knex.CreateTableBuilder) => any;

export type TableDefinition<Columns> = {
  name: string,
  schema: { [K in keyof Columns]: string },
  builder: CreateTableFunc
};


export type TableName = string | knex.Raw | knex.QueryBuilder;
export type ColumnType = string | knex.Raw | knex.QueryBuilder | { [key: string]: string };