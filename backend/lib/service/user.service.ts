import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
// import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { USER_TABLES } from '../schema/user';
import { DBService } from './db.service';

export class UserService implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBService) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing User Service Start');

    await this.db.createTable(USER_TABLES.USER, false);
    await this.db.createTable(USER_TABLES.HISTORY, false);
    await this.db.createTable(USER_TABLES.RESULT, false);
    await this.db.createTable(USER_TABLES.GROUP, false);
    await this.db.createTable(USER_TABLES.GAME_LIST, false);

    this.logger.info('Initializing User Service End');

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
}