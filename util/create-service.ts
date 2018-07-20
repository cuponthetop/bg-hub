import { RunConfig } from '../types/config';
import { DBService } from '../lib/service/db.service';
import { GameService } from '../lib/service/game.service';
import { LoggerInstance } from 'winston';
import { ServiceList } from '../types/service-list';

export async function createServices(config: RunConfig, logger: LoggerInstance): Promise<ServiceList> {
  let db: DBService = new DBService(config.db.username, config.db.password, config.db.db, config.db.host);
  let game: GameService = new GameService(logger, db);

  let ret: ServiceList = {
    db,
    game
  };

  await db.init();
  await game.init();

  return ret;
};