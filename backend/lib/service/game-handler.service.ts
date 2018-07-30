import { Service } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
import { Request, Response } from 'express';
import 'body-parser';
import { GameService } from './game.service';
import { SimpleGame, Game } from '../model/game';

export class GameHandlerService implements Service {

  constructor(private logger: LoggerInstance, private gameSvc: GameService) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing Game Handler Service Start');

    this.logger.info('Initializing Game Handler Service End');

    return true;
  }

  async destroy(): Promise<boolean> {
    return true;
  }

  immediateCleanup(): boolean {
    return true;
  }

  async createGame(req: Request, res: Response): Promise<void> {
    try {
      const playerRange: number[] = _.uniq(req.body.players);
      const titleKo: string = req.body.title_ko;
      const titleEn: string = req.body.title_en;

      let result: SimpleGame = await this.gameSvc.createGame(playerRange, titleKo, titleEn);

      res.status(200).json(result);
      return;
    } catch (e) {
      res.status(500).json(JSON.stringify(e));
      return;
    }
  }

  async getGame(req: Request, res: Response): Promise<void> {
    try {
      const gid: number = req.params.gid;

      let result: Game = await this.gameSvc.loadGame(gid);

      res.status(200).json(result);
      return;
    } catch (e) {
      res.status(500).json(JSON.stringify(e));
      return;
    }
  }
}