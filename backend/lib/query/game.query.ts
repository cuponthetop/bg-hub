import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
// import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { Game, SimpleGame } from '../model/game';
import { GAME_TABLES, GameRow, GameRelationRow } from '../schema/game';
import { DBQuery } from './db.query';
import { LocaleQuery } from './locale.query';
import { LocaleItem } from '../model/common';

export class GameQuery implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBQuery, private locale: LocaleQuery) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing Game Query Start');

    this.logger.info('Initializing Game Query End');

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

  convertGameRowToSimpleGame(game: GameRow): SimpleGame {
    return new SimpleGame(game.id, game.playerRange, game.title, game.created_at, game.updated_at);
  }

  async loadGame(gameID: number): Promise<Game> {
    let game: GameRow = await this.db.select('*').from(GAME_TABLES.GAME.name).where({ id: gameID });
    let relations: GameRelationRow[] = await this.db.select('*').from(GAME_TABLES.RELATION.name).where({ sourceID: gameID }).orWhere({ targetID: gameID });
    let msg: LocaleItem = await this.locale.getLocale(game.title);

    return new Game(game.id, relations, game.playerRange, game.title, msg, game.created_at, game.updated_at);
  }

  async loadSimpleGame(gameID: number): Promise<SimpleGame> {
    let game: GameRow = await this.db.select('*').from(GAME_TABLES.GAME.name).where({ id: gameID });

    return this.convertGameRowToSimpleGame(game);
  }
}