import { RunConfig } from '../types/config';
import { LoggerInstance } from 'winston';
import { ServiceList } from '../types/service-list';

import { DBService } from '../lib/service/db.service';
import { GameService } from '../lib/service/game.service';
import { LocaleService } from '../lib/service/locale.service';
import { UserService } from '../lib/service/user.service';
import { GameHandlerService } from '../lib/service/game-handler.service';
import { UserHandlerService } from '../lib/service/user-handler.service';

export async function createServices(config: RunConfig, logger: LoggerInstance): Promise<ServiceList> {
  let db: DBService = new DBService(config.db.username, config.db.password, config.db.db, config.db.host);

  let locale: LocaleService = new LocaleService(logger, db);
  let game: GameService = new GameService(logger, db, locale);
  let user: UserService = new UserService(logger, db, game);

  let gameHandler: GameHandlerService = new GameHandlerService(logger, game);
  let userHandler: UserHandlerService = new UserHandlerService(logger, user, config.gapiClientID);

  let ret: ServiceList = {
    gameHandler,
    locale,
    userHandler
  };

  await db.init();

  await locale.init();
  await game.init();
  await user.init();

  await gameHandler.init();
  await userHandler.init();

  return ret;
};