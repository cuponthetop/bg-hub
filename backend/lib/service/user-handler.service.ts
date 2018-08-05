import { Service } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
import { Request, Response } from 'express';
import { UserQuery } from '../query/user.query';
import { UserCommand } from '../command/user.command';
import { OAuth2Client } from 'google-auth-library';
import { LoginTicket, TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { SimpleUser, User } from '../model/user';
import { Nullable, Omit } from '../../types/util';

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

    const ticket: LoginTicket = await this.gapiClient.verifyIdToken({
      idToken: authID,
      audience: this.clientID
    });

    const payload: TokenPayload = ticket.getPayload();
    const userid: string = payload.sub;

    try {
      const user: Nullable<SimpleUser> = await this.userQr.loadSimpleUserByAuth(userid);
      let id: number = null;
      if (_.isNull(user)) {

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
    const omitList: string[] = ["authID"];

    try {
      let result: Nullable<Omit<User, 'authID'>> = await this.userQr.loadUser(uid);

      if (_.isNull(result)) {
        res.status(404).json();
      } else {
        res.status(200).json(_.omit(result, omitList));
      }
      return;
    }
    catch (e) {
      res.status(500).json(JSON.stringify(e));
    }
  }

  async findUser(req: Request, res: Response): Promise<void> {
    const authID: string = req.query.authID;
    const ticket: LoginTicket = await this.gapiClient.verifyIdToken({
      idToken: authID,
      audience: this.clientID
    });

    const payload: TokenPayload = ticket.getPayload();
    const userid: string = payload.sub;

    try {
      let result: Nullable<SimpleUser> = await this.userQr.loadSimpleUserByAuth(userid);

      if (_.isNull(result)) {
        res.status(404).json();
      } else {
        res.status(200).json({ id: result.id });
      }
      return;
    }
    catch (e) {
      res.status(500).json(JSON.stringify(e));
    }
  }
}