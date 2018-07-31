import { RunConfig } from '../types/config';
import { LoggerInstance } from 'winston';
import { ServiceList } from '../types/service-list';

import { DBCommand } from '../lib/command/db.command';
import { GameCommand } from '../lib/command/game.command';
import { LocaleCommand } from '../lib/command/locale.command';
import { UserCommand } from '../lib/command/user.command';

import { LocaleQuery } from '../lib/query/locale.query';
import { UserQuery } from '../lib/query/user.query';
import { GameQuery } from '../lib/query/game.query';
import { DBQuery } from '../lib/query/db.query';

import { GameHandlerService } from '../lib/service/game-handler.service';
import { UserHandlerService } from '../lib/service/user-handler.service';
import { GroupHandlerService } from '../lib/service/group-handler.service';

export async function createServices(config: RunConfig, logger: LoggerInstance): Promise<ServiceList> {

  let dbC: DBCommand = new DBCommand(config.db.username, config.db.password, config.db.db, config.db.host);

  let localeC: LocaleCommand = new LocaleCommand(logger, dbC);
  let gameC: GameCommand = new GameCommand(logger, dbC, localeC);
  let userC: UserCommand = new UserCommand(logger, dbC);

  let dbQ: DBQuery = new DBQuery(config.db.username, config.db.password, config.db.db, config.db.host);

  let localeQ: LocaleQuery = new LocaleQuery(logger, dbQ);
  let gameQ: GameQuery = new GameQuery(logger, dbQ, localeQ);
  let userQ: UserQuery = new UserQuery(logger, dbQ, gameQ);

  let gameHandler: GameHandlerService = new GameHandlerService(logger, gameC, gameQ);
  let userHandler: UserHandlerService = new UserHandlerService(logger, userC, userQ, config.gapiClientID);
  let groupHandler: GroupHandlerService = new GroupHandlerService(logger, userC, userQ);

  let ret: ServiceList = {
    gameHandler,
    userHandler,
    groupHandler
  };

  await dbC.init();
  await localeC.init();
  await gameC.init();
  await userC.init();

  await dbQ.init();
  await localeQ.init();
  await gameQ.init();
  await userQ.init();

  await gameHandler.init();
  await userHandler.init();

  return ret;
};