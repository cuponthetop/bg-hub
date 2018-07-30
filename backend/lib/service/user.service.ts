import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { USER_TABLES, UserRow, GroupRow, HistoryRow, ResultRow, GroupMemberRow } from '../schema/user';
import { DBService } from './db.service';
import { SimpleUser, User, GameListItem, History, Group, Result } from '../model/user';
import { GameService } from './game.service';
// import { SimpleGame } from '../model/game';
import { GAME_TABLES, GameRow } from '../schema/game';

export class UserService implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBService, private game: GameService) {
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

  async createUser(authID: string, username: string, email: string): Promise<SimpleUser> {
    let created: Date = new Date();
    let input: UserRow = new UserRow(null, authID, username, email, created, created);

    input = await this.db.table(USER_TABLES.USER.name).insert(input);

    return converUserRowToSimpleUser(input);
  }


  async loadSimpleUserByAuth(authID: string): Promise<SimpleUser> {
    let user: UserRow = await this.db.qb.select('*').from(USER_TABLES.USER.name).where({ authID });
    return converUserRowToSimpleUser(user);
  }

  async loadSimpleUser(userID: number): Promise<SimpleUser> {
    let user: UserRow = await this.db.qb.select('*').from(USER_TABLES.USER.name).where({ id: userID });
    return converUserRowToSimpleUser(user);
  }

  async loadUser(userID: number): Promise<User> {
    let user: UserRow = await this.db.qb.select('*').from(USER_TABLES.USER.name).where({ id: userID });
    let groupIDs: number[] = await this.db.qb.select([USER_TABLES.GROUP_MEMBER.schema.id]).from(USER_TABLES.GROUP_MEMBER.name).where({ member: userID });
    let groups: Group[] = await Promise.all(_.map(groupIDs, async (groupID: number): Promise<Group> => await this.loadGroup(groupID)));
    let gameList: GameListItem[] = await this.loadGameList(userID);
    let history: History[] = await this.loadHistory(userID);

    return new User(
      user.id, user.authID, user.username, user.email,
      gameList, history, groups,
      user.created_at, user.updated_at
    );
  }

  async loadGroup(groupID: number): Promise<Group> {
    let members: SimpleUser[] = await this.db
      .table(USER_TABLES.USER.name)
      .innerJoin(
        USER_TABLES.GROUP_MEMBER.name,
        `${USER_TABLES.USER.name}.${USER_TABLES.USER.schema.id}`,
        `${USER_TABLES.GROUP_MEMBER.name}.${USER_TABLES.GROUP_MEMBER.schema.member}`
      )
      .where({ id: groupID })
      .select(`${USER_TABLES.USER.name}.*`);

    let groupRow: GroupRow = await this.db.qb.select('*').from(USER_TABLES.GROUP.name).where({ id: groupID });

    return new Group(groupID, groupRow.name, members);
  }

  async loadGameList(userID: number): Promise<GameListItem[]> {
    const userField: string = `${USER_TABLES.GAME_LIST.name}.${USER_TABLES.GAME_LIST.schema.user}`;
    let gameList: { GAME: GameRow, "GAME_LIST.type": "own" }[] = await this.db
      .table(USER_TABLES.GAME_LIST.name)
      .innerJoin(
        GAME_TABLES.GAME.name,
        `${USER_TABLES.GAME_LIST.name}.${USER_TABLES.GAME_LIST.schema.game}`,
        `${GAME_TABLES.GAME.name}.${GAME_TABLES.GAME.schema.id}`
      )
      .where({ [userField]: userID })
      .select([`${GAME_TABLES.GAME.name}.*`, `${USER_TABLES.GAME_LIST.name}.${USER_TABLES.GAME_LIST.schema.type}`]);

    return _.map(gameList, (listItem: { GAME: GameRow, "GAME_LIST.type": "own" }): GameListItem => {
      return new GameListItem(this.game.convertGameRowToSimpleGame(listItem.GAME), listItem["GAME_LIST.type"]);
    });
  }

  async loadHistory(userID: number): Promise<History[]> {
    const userField: string = `${USER_TABLES.HISTORY.name}.${USER_TABLES.HISTORY.schema.user}`;
    let histories: { GAME: GameRow, HISTORY: Partial<HistoryRow> }[] = await this.db
      .table(USER_TABLES.HISTORY.name)
      .innerJoin(
        GAME_TABLES.GAME.name,
        `${USER_TABLES.HISTORY.name}.${USER_TABLES.HISTORY.schema.game}`,
        `${GAME_TABLES.GAME.name}.${GAME_TABLES.GAME.schema.id}`
      )
      .where({ [userField]: userID })
      .select([
        `${GAME_TABLES.GAME.name}.*`,
        `${USER_TABLES.HISTORY.name}.${USER_TABLES.HISTORY.schema.from}`,
        `${USER_TABLES.HISTORY.name}.${USER_TABLES.HISTORY.schema.id}`,
        `${USER_TABLES.HISTORY.name}.${USER_TABLES.HISTORY.schema.to}`,
        `${USER_TABLES.HISTORY.name}.${USER_TABLES.HISTORY.schema.location}`
      ]);

    return await Promise.all(_.map(histories, async (listItem: { GAME: GameRow, HISTORY: Partial<HistoryRow> }): Promise<History> => {
      let results: Result[] = await this.loadResult(listItem.HISTORY.id);
      return new History(listItem.HISTORY.id, this.game.convertGameRowToSimpleGame(listItem.GAME), results, listItem.HISTORY.from, listItem.HISTORY.to, listItem.HISTORY.location);
    }));
  }

  async loadResult(historyID: number): Promise<Result[]> {

    const historyField: string = `${USER_TABLES.RESULT.name}.${USER_TABLES.RESULT.schema.history}`;
    let results: { USER: UserRow, RESULT: Partial<ResultRow> }[] = await this.db
      .table(USER_TABLES.RESULT.name)
      .innerJoin(
        USER_TABLES.USER.name,
        `${USER_TABLES.RESULT.name}.${USER_TABLES.RESULT.schema.player}`,
        `${USER_TABLES.USER.name}.${USER_TABLES.USER.schema.id}`
      )
      .where({ [historyField]: historyID })
      .select([
        `${USER_TABLES.USER.name}.*`,
        `${USER_TABLES.RESULT.name}.${USER_TABLES.RESULT.schema.id}`,
        `${USER_TABLES.RESULT.name}.${USER_TABLES.RESULT.schema.score}`,
      ]);
    return _.map(results, (listItem: { USER: UserRow, RESULT: Partial<ResultRow> }): Result => {
      return new Result(listItem.RESULT.id, listItem.USER, listItem.RESULT.score);
    });
  }

  async createGroup(name: string): Promise<Group> {
    let input: GroupRow = new GroupRow(null, name);
    input = await this.db.table(USER_TABLES.GROUP.name).insert(input);

    return await this.loadGroup(input.id);
  }

  async addMemberToGroup(uid: number, groupid: number): Promise<Group> {
    let input: GroupMemberRow = new GroupMemberRow(groupid, uid);

    input = await this.db.table(USER_TABLES.GROUP_MEMBER.name).insert(input);

    return await this.loadGroup(groupid);
  }

  async removeMemberFromGroup(uid: number, groupid: number): Promise<Group> {
    await this.db.table(USER_TABLES.GROUP_MEMBER.name).where({
      [USER_TABLES.GROUP_MEMBER.schema.id]: groupid,
      [USER_TABLES.GROUP_MEMBER.schema.member]: uid
    }).delete();

    return await this.loadGroup(groupid);
  }
}


function converUserRowToSimpleUser(user: UserRow): SimpleUser {
  return new SimpleUser(user.id, user.authID, user.username, user.email, user.created_at, user.updated_at);
}
