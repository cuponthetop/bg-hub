import { Service } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
// import { SimpleUser, User, GameListItem, History, Group, Result } from '../model/user';
import { Request, Response, NextFunction } from 'express';
import 'body-parser';
import { UserService } from './user.service';
import { OAuth2Client } from 'google-auth-library';
import { LoginTicket, TokenPayload } from 'google-auth-library/build/src/auth/loginticket';

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

    const ticket: LoginTicket = await this.gapiClient.verifyIdToken({
      idToken: req.body.token,
      audience: this.clientID
    });

    const payload: TokenPayload = ticket.getPayload();
    const userid: string = payload.sub;
    const email: string = payload.email;

  }
}