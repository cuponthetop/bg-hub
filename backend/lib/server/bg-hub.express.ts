import { ExpressServer } from '../../types/express.server';
import { Router } from 'express';
import { UserHandlerService } from '../service/user-handler.service';
import { check } from 'express-validator/check';
import { handleValidationResult } from '../../util/validate-response';

export class BGHubExpress extends ExpressServer {

  populateRouter(): Router {
    let router: Router = Router();

    router.use('/api');

    router.post('/user/signin',
      [
        check('token').isString()
      ],
      handleValidationResult,
      (<UserHandlerService>this.services.userHandler).createUser.bind(this.services.userHandler)
    );

    return router;
  }
};