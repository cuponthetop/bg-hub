import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { GAME_TABLES, GameRow } from '../schema/game';
import { DBCommand } from './db.command';
import { LocaleCommand } from './locale.command';

export class GameCommand implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBCommand, private locale: LocaleCommand) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing Game Command Start');

    await this.db.createTable(GAME_TABLES.GAME, false);
    await this.db.createTable(GAME_TABLES.RELATION, false);

    this.logger.info('Initializing Game Command End');

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

  async createGame(playerRange: number[], titleKo: string, titleEn: string,
    box: { width: number, height: number, depth: number }, setting: { width: number, height: number }
  ): Promise<number> {
    let created: Date = new Date();
    let localeID: number = await this.locale.createLocale(titleKo, titleEn);
    let input: GameRow = new GameRow(undefined, playerRange, localeID, box.width, box.height, box.depth, setting.width, setting.height, created, created);

    let result: Pick<GameRow, 'id'>[] = await this.db.table(GAME_TABLES.GAME.name).insert(input);
    return _.head(result).id;
  }
}