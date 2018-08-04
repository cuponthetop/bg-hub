import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { LocaleRow, COMMON_TABLES } from '../schema/common';
import { DBQuery } from './db.query';
import { LocaleItem } from '../model/common';
import { Nullable } from '../../types/util';

export class LocaleQuery implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBQuery) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing Locale Query Start');

    this.logger.info('Initializing Locale Query End');

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

  private convertLocaleRowToLocaleItem(locale: LocaleRow): LocaleItem {
    return new LocaleItem(locale.ko, locale.en);
  }

  async getLocale(id: number): Promise<Nullable<LocaleItem>> {
    let row: LocaleRow[] = await this.db.select('*').from(COMMON_TABLES.LOCALE.name).where({ localeID: id });
    return _.isEmpty(row) ? null : this.convertLocaleRowToLocaleItem(_.head(row));
  }
}