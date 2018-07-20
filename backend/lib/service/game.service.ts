import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
// import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { Game, GAME_TABLES, GameSchemaBuilder } from '../model/game';
import { DBService } from './db.service';

export class GameService implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBService) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing Game Service Start');

    await this.db.createTable(GAME_TABLES.GAME, GameSchemaBuilder, false);

    this.logger.info('Initializing Game Service End');

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

  async createGame(): Promise<Game> {
    return new Game(0, [], [], 0, new Date(), new Date());
  }
}