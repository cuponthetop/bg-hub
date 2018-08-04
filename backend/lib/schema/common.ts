import * as knex from 'knex';
import { TableDefinition } from '../../types/schema';
export type LocaleID = number;

export class LocaleRow {
  constructor(
    public localeID: LocaleID,
    public ko: string,
    public en: string,
  ) { }
}

const LOCALE: TableDefinition<LocaleRow> = {
  name: "LOCALE",
  schema: { localeID: "localeID", ko: 'ko', en: 'en' },
  builder: LocaleSchemaBuilder
};

export const COMMON_TABLES = {
  LOCALE
};

function LocaleSchemaBuilder(table: knex.CreateTableBuilder) {
  table.increments(COMMON_TABLES.LOCALE.schema.localeID).notNullable().primary();

  table.string(COMMON_TABLES.LOCALE.schema.ko, 512);
  table.string(COMMON_TABLES.LOCALE.schema.en, 512);
};