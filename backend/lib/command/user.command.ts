import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { USER_TABLES, UserRow, GroupRow, GroupMemberRow } from '../schema/user';
import { DBCommand } from './db.command';

export class UserCommand implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBCommand) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing User Service Start');

    await this.db.createTable(USER_TABLES.USER, false);
    await this.db.createTable(USER_TABLES.HISTORY, false);
    await this.db.createTable(USER_TABLES.RESULT, false);
    await this.db.createTable(USER_TABLES.GROUP, false);
    await this.db.createTable(USER_TABLES.GAME_LIST, false);
    await this.db.createTable(USER_TABLES.GROUP_MEMBER, false);

    this.logger.info('Initializing User Service End');

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

  async createUser(authID: string, username: string, email: string): Promise<number> {
    let created: Date = new Date();
    let input: UserRow = new UserRow(undefined, authID, username, email, created, created);

    let result: Pick<UserRow, 'id'>[] = await this.db.table(USER_TABLES.USER.name).insert(input).returning([USER_TABLES.USER.schema.id]);

    return _.head(result).id;
  }


  async createGroup(name: string): Promise<number> {
    let input: GroupRow = new GroupRow(undefined, name);
    let result: Pick<GroupRow, 'id'>[] = await this.db.table(USER_TABLES.GROUP.name).insert(input).returning([USER_TABLES.GROUP.schema.id]);

    return _.head(result).id;
  }

  async addMemberToGroup(uid: number, groupid: number): Promise<void> {
    let input: GroupMemberRow = new GroupMemberRow(groupid, uid);

    let result = await this.db.table(USER_TABLES.GROUP_MEMBER.name).insert(input);

    this.logger.info(JSON.stringify(result));
    return;
  }

  async removeMemberFromGroup(uid: number, groupid: number): Promise<void> {
    let result = await this.db.table(USER_TABLES.GROUP_MEMBER.name).delete().where({
      [USER_TABLES.GROUP_MEMBER.schema.id]: groupid,
      [USER_TABLES.GROUP_MEMBER.schema.member]: uid
    });

    this.logger.info(JSON.stringify(result));
    return;
  }
}
