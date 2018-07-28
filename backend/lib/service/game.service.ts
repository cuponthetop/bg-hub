import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
// import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { Game, SimpleGame } from '../model/game';
import { GAME_TABLES, GameRow, GameRelationRow } from '../schema/game';
import { DBService } from './db.service';
import { LocaleService } from './locale.service';
import { LocaleItem } from '../model/common';

export class GameService implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBService, private locale: LocaleService) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing Game Service Start');

    await this.db.createTable(GAME_TABLES.GAME, false);
    await this.db.createTable(GAME_TABLES.RELATION, false);

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

  async createGame(playerRange: number[], titleKo: string, titleEn: string): Promise<SimpleGame> {
    let created: Date = new Date();
    let localeID: number = await this.locale.createLocale(titleKo, titleEn);
    let input: GameRow = new GameRow(null, playerRange, localeID, created, created);

    input = await this.db.table(GAME_TABLES.GAME.name).insert(input);
    return this.convertGameRowToSimpleGame(input);
  }

  convertGameRowToSimpleGame(game: GameRow): SimpleGame {
    return new SimpleGame(game.id, game.playerRange, game.title, game.created_at, game.updated_at);
  }

  async loadGame(gameID: number): Promise<Game> {
    let game: GameRow = await this.db.qb.select('*').from(GAME_TABLES.GAME.name).where({ id: gameID });
    let relations: GameRelationRow[] = await this.db.qb.select('*').from(GAME_TABLES.RELATION.name).where({ sourceID: gameID }).orWhere({ targetID: gameID });
    let msg: LocaleItem = await this.locale.getLocale(game.title);

    return new Game(game.id, relations, game.playerRange, game.title, msg, game.created_at, game.updated_at);
  }
}