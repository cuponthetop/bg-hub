import { SharableService, Controllable } from '../../types/service';
import { LoggerInstance } from 'winston';
import * as _ from 'lodash';
// import { LRUCache } from '../../util/lru';
import { USER_TABLES, UserRow, GroupRow, HistoryRow, ResultRow } from '../schema/user';
import { DBQuery } from './db.Query';
import { SimpleUser, User, GameListItem, History, Group, Result } from '../model/user';
import { GameQuery } from './game.Query';
// import { SimpleGame } from '../model/game';
import { GAME_TABLES, GameRow } from '../schema/game';
import { Nullable } from '../../types/util';

export class UserQuery implements SharableService {

  constructor(private logger: LoggerInstance, private db: DBQuery, private game: GameQuery) {
  }

  async init(): Promise<boolean> {
    this.logger.info('Initializing User Query Start');

    this.logger.info('Initializing User Query End');

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

  async loadSimpleUserByAuth(authID: string): Promise<Nullable<SimpleUser>> {
    let user: UserRow[] = await this.db.select('*').from(USER_TABLES.USER.name).where({ authID });
    return _.isEmpty(user) ? null : converUserRowToSimpleUser(_.head(user));
  }

  async loadSimpleUser(userID: number): Promise<Nullable<SimpleUser>> {
    let user: UserRow[] = await this.db.select('*').from(USER_TABLES.USER.name).where({ id: userID });
    return _.isEmpty(user) ? null : converUserRowToSimpleUser(_.head(user));
  }

  async loadUser(userID: number): Promise<Nullable<User>> {
    let ret: Nullable<User> = null;
    let user: UserRow = await this.db.select('*').from(USER_TABLES.USER.name).where({ id: userID });
    if (false === _.isEmpty(user)) {

      let groupIDs: number[] = await this.db.select(USER_TABLES.GROUP_MEMBER.schema.id).from(USER_TABLES.GROUP_MEMBER.name).where({ member: userID });
      let groups: Group[] = await Promise.all(_.map(groupIDs, async (groupID: number): Promise<Group> => await this.loadGroup(groupID)));
      let gameList: GameListItem[] = await this.loadGameList(userID);
      let history: History[] = await this.loadHistory(userID);

      ret = new User(
        user.id, null, user.username, user.email,
        gameList, history, groups,
        user.created_at, user.updated_at
      );
    }

    return ret;
  }

  async loadGroup(groupID: number): Promise<Nullable<Group>> {
    let ret: Nullable<Group> = null;
    let groupRow: GroupRow = await this.db.select('*').from(USER_TABLES.GROUP.name).where({ id: groupID });

    if (false === _.isEmpty(groupRow)) {

      let members: SimpleUser[] = await this.db
        .table(USER_TABLES.USER.name)
        .innerJoin(
          USER_TABLES.GROUP_MEMBER.name,
          `${USER_TABLES.USER.name}.${USER_TABLES.USER.schema.id}`,
          `${USER_TABLES.GROUP_MEMBER.name}.${USER_TABLES.GROUP_MEMBER.schema.member}`
        )
        .where({ id: groupID })
        .select(`${USER_TABLES.USER.name}.*`);

      ret = new Group(groupID, groupRow.name, members);
    }
    return ret;
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
        // `${USER_TABLES.HISTORY.name}.${USER_TABLES.HISTORY.schema.location}`
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

}


function converUserRowToSimpleUser(user: UserRow): SimpleUser {
  return new SimpleUser(user.id, user.authID, user.username, user.email, user.created_at, user.updated_at);
}
