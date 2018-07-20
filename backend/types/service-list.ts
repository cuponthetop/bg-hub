import { DBService } from '../lib/service/db.service';
import { GameService } from '../lib/service/game.service';

import { BGHubExpress } from '../lib/server/bg-hub.express';
import { BGHubWS } from '../lib/server/bg-hub.ws';

export type ServiceList = {
  db: DBService,
  game: GameService
};

export type ServerList = {
  express: BGHubExpress,
  ws: BGHubWS
};