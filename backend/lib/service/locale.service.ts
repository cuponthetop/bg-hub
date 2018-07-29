import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
// import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { LocaleRow, COMMON_TABLES } from '../schema/common';
import { DBService } from './db.service';
import { LocaleItem } from '../model/common';

export class LocaleService implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBService) {
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
    let row: LocaleRow = new LocaleRow(null, ko, en);

    row = await this.db.table(COMMON_TABLES.LOCALE.name).insert(row);
    return row.localeID;
  }

  private convertLocaleRowToLocaleItem(locale: LocaleRow): LocaleItem {
    return new LocaleItem(locale.ko, locale.en);
  }

  async getLocale(id: number): Promise<LocaleItem> {
    let row: LocaleRow = await this.db.qb.select('*').from(COMMON_TABLES.LOCALE.name).where({ localeID: id });
    return this.convertLocaleRowToLocaleItem(row);
  }

  async updateLocale(id: number, target: string & keyof LocaleItem, value: string): Promise<LocaleItem> {
    let row: LocaleRow = await this.db.table(COMMON_TABLES.LOCALE.name).where({ localeID: id }).update(target, value);
    return this.convertLocaleRowToLocaleItem(row);
  }
}