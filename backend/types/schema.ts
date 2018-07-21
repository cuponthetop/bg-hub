import * as knex from 'knex';

export type CreateTableFunc = (table: knex.CreateTableBuilder) => any;

export type TableDefinition<Columns> = {
  name: string,
  schema: { [K in keyof Columns]: string },
  builder: CreateTableFunc
};
