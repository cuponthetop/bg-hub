import { Service } from '../../types/service';
import { LoggerInstance } from 'winston';
// import * as _ from 'lodash';
import { Request, Response } from 'express';
import 'body-parser';
import { UserService } from './user.service';
import { OAuth2Client } from 'google-auth-library';
import { LoginTicket, TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { SimpleUser, User } from '../model/user';

export class UserHandlerService implements Service {
  gapiClient: OAuth2Client = null;


  constructor(private logger: LoggerInstance, private userSvc: UserService, private clientID: string) {
    this.gapiClient = new OAuth2Client(clientID);
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing User Handler Service Start');

    this.logger.info('Initializing User Handler Service End');

    return true;
  }

  async destroy(): Promise<boolean> {
    return true;
  }

  immediateCleanup(): boolean {
    return true;
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const authID: string = req.body.token;

    try {
      const ticket: LoginTicket = await this.gapiClient.verifyIdToken({
        idToken: authID,
        audience: this.clientID
      });

      const payload: TokenPayload = ticket.getPayload();
      const userid: string = payload.sub;
      const username: string = payload.name;
      const email: string = payload.email;

      let result: SimpleUser = await this.userSvc.createUser(userid, username, email);

      res.status(200).json(result);
      return;
    }
    catch (e) {
      res.status(500).json(JSON.stringify(e));
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const uid: number = req.params.uid;

    try {
      let result: User = await this.userSvc.loadUser(uid);

      res.status(200).json(result);
      return;
    }
    catch (e) {
      res.status(500).json(JSON.stringify(e));
    }
  }
}