import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { Game, SimpleGame } from '../model/game';
import { GAME_TABLES, GameRow, GameRelationRow } from '../schema/game';
import { DBQuery } from './db.query';
import { LocaleQuery } from './locale.query';
import { LocaleItem } from '../model/common';
import { Nullable } from '../../types/util';

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
    return new SimpleGame(game.id, game.playerRange, game.title, game.created_at, game.updated_at,
      { width: game.boxWidth, height: game.boxHeight, depth: game.boxDepth },
      { width: game.settingWidth, height: game.settingHeight }
    );
  }

  async loadGame(gameID: number): Promise<Nullable<Game>> {
    let ret: Nullable<Game> = null;
    let games: GameRow[] = await this.db.select('*').from(GAME_TABLES.GAME.name).where({ id: gameID });

    if (_.isEmpty(games)) {
      const game: GameRow = _.head(games);
      let relations: GameRelationRow[] = await this.db.select('*').from(GAME_TABLES.RELATION.name).where({ sourceID: gameID }).orWhere({ targetID: gameID });
      let msg: LocaleItem = await this.locale.getLocale(game.title);

      ret = new Game(game.id, relations, game.playerRange, game.title, msg, game.created_at, game.updated_at,
        { width: game.boxWidth, height: game.boxHeight, depth: game.boxDepth },
        { width: game.settingWidth, height: game.settingHeight }
      );
    }
    return ret;
  }

  async loadSimpleGame(gameID: number): Promise<Nullable<SimpleGame>> {
    let game: GameRow[] = await this.db.select('*').from(GAME_TABLES.GAME.name).where({ id: gameID });

    return _.isEmpty(game) ? null : this.convertGameRowToSimpleGame(game[0]);
  }
}