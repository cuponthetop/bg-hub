import { ExpressServer } from '../../types/express.server';
import { Router } from 'express';

import { UserHandlerService } from '../service/user-handler.service';
import { GameHandlerService } from '../service/game-handler.service';
import { GroupHandlerService } from '../service/group-handler.service';

import { userRouter } from './router/user';
import { gameRouter } from './router/game';
import { groupRouter } from './router/group';

export class BGHubExpress extends ExpressServer {

  populateRouter(): Router {
    let router: Router = Router();

    router.use('/api');

    router.use('/user', userRouter(<UserHandlerService>this.services.userHandler));
    router.use('/game', gameRouter(<GameHandlerService>this.services.gameHandler));
    router.use('/group', groupRouter(<GroupHandlerService>this.services.groupHandler));


    return router;
  }
};