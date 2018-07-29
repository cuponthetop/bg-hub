import { Service } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import 'body-parser';
import { GameService } from './game.service';

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

  createGame(req: Request, res: Response) {

  }
}