import { Service } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
import { Request, Response } from 'express';
import { UserQuery } from '../query/user.query';
import { UserCommand } from '../command/user.command';
import { OAuth2Client } from 'google-auth-library';
import { LoginTicket, TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { SimpleUser, User } from '../model/user';
import { Nullable } from '../../types/util';

export class UserHandlerService implements Service {
  gapiClient: OAuth2Client = null;


  constructor(private logger: LoggerInstance, private userCmd: UserCommand, private userQr: UserQuery, private clientID: string) {
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
      const user: Nullable<SimpleUser> = await this.userQr.loadSimpleUserByAuth(authID);
      let id: number = null;
      if (_.isNull(user)) {

        const ticket: LoginTicket = await this.gapiClient.verifyIdToken({
          idToken: authID,
          audience: this.clientID
        });

        const payload: TokenPayload = ticket.getPayload();
        const userid: string = payload.sub;
        const username: string = payload.name;
        const email: string = payload.email;

        id = await this.userCmd.createUser(userid, username, email);
      } else {
        id = user.id;
      }

      res.status(200).json({ id });
      return;
    }
    catch (e) {
      res.status(500).json(JSON.stringify(e));
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const uid: number = req.params.uid;

    try {
      let result: Nullable<User> = await this.userQr.loadUser(uid);

      res.status(200).json(result);
      return;
    }
    catch (e) {
      res.status(500).json(JSON.stringify(e));
    }
  }
}