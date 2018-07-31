import { Service } from '../../types/service';
import { LoggerInstance } from 'winston';
// import * as _ from 'lodash';
import { Request, Response } from 'express';
import { UserQuery } from '../query/user.query';
import { UserCommand } from '../command/user.command';
import { Group } from '../model/user';

export class GroupHandlerService implements Service {

  constructor(private logger: LoggerInstance, private userCmd: UserCommand, private userQr: UserQuery) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing Group Handler Service Start');

    this.logger.info('Initializing Group Handler Service End');

    return true;
  }

  async destroy(): Promise<boolean> {
    return true;
  }

  immediateCleanup(): boolean {
    return true;
  }

  async createGroup(req: Request, res: Response): Promise<void> {
    try {
      const name: string = req.body.name;

      await this.userCmd.createGroup(name);
      res.status(200).json(null);
      return;
    }
    catch (e) {
      res.status(500).json(JSON.stringify(e));
    }
  }

  async getGroup(req: Request, res: Response): Promise<void> {
    try {
      const groupid: number = req.params.groupid;
      let result: Group = await this.userQr.loadGroup(groupid);
      res.status(200).json(result);
      return;
    }
    catch (e) {
      res.status(500).json(JSON.stringify(e));
    }

  }
}