import * as knex from 'knex';
export type LocaleID = number;

export class LocaleItem {
  localeID: LocaleID;
  message: string;
}

export enum COMMON_TABLES {
  LOCALE = "LOCALE",
};

export function LocaleSchemaBuilder(table: knex.CreateTableBuilder) {
  table.primary(['localeID']);

  table.string('message');
};