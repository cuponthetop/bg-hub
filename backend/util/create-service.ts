import { RunConfig } from '../types/config';
import { LoggerInstance } from 'winston';
import { ServiceList } from '../types/service-list';

import { DBService } from '../lib/service/db.service';
import { GameService } from '../lib/service/game.service';
import { LocaleService } from '../lib/service/locale.service';
import { UserService } from '../lib/service/user.service';

export async function createServices(config: RunConfig, logger: LoggerInstance): Promise<ServiceList> {
  let db: DBService = new DBService(config.db.username, config.db.password, config.db.db, config.db.host);
  let locale: LocaleService = new LocaleService(logger, db);
  let game: GameService = new GameService(logger, db, locale);
  let user: UserService = new UserService(logger, db, game);

  let ret: ServiceList = {
    db,
    game,
    locale,
    user
  };

  await db.init();
  await game.init();
  await locale.init();
  await user.init();

  return ret;
};