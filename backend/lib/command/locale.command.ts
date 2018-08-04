import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { LocaleRow, COMMON_TABLES } from '../schema/common';
import { DBCommand } from './db.command';
import { LocaleItem } from '../model/common';

export class LocaleCommand implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBCommand) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing Locale Service Start');

    await this.db.createTable(COMMON_TABLES.LOCALE, false);

    this.logger.info('Initializing Locale Service End');

    return true;
  }

  async destroy(): Promise<boolean> {
    return true;
  }

  immediateCleanup(): boolean {
    return true;
  }

  async takeControl(requester: Controllable): Promise<boolean> {
    requester;
    return true;
  }

  async createLocale(ko: string, en: string): Promise<number> {
    let row: LocaleRow = new LocaleRow(undefined, ko, en);

    let result: Pick<LocaleRow, 'localeID'>[] = await this.db.table(COMMON_TABLES.LOCALE.name).insert(row).returning(COMMON_TABLES.LOCALE.schema.localeID);
    return _.head(result).localeID;
  }

  private convertLocaleRowToLocaleItem(locale: LocaleRow): LocaleItem {
    return new LocaleItem(locale.ko, locale.en);
  }

  async updateLocale(id: number, target: string & keyof LocaleItem, value: string): Promise<LocaleItem> {
    let row: LocaleRow[] = await this.db.table(COMMON_TABLES.LOCALE.name).update(target, value).where({ localeID: id }).returning('*');
    return this.convertLocaleRowToLocaleItem(_.head(row));
  }
}