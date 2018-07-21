import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
// import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { LocaleRow, COMMON_TABLES } from '../schema/common';
import { DBService } from './db.service';

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

  async createLocale(): Promise<LocaleRow> {
    return new LocaleRow(0, '', '');
  }

  async setLocale(id: number, language: string & keyof LocaleRow): Promise<boolean> {
    id;
    language
    return true;
  }
}