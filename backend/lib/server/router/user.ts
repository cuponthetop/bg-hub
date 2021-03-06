import { Router } from 'express';
import { UserHandlerService } from '../../service/user-handler.service';
import { body, param, query } from 'express-validator/check';
import { handleValidationResult } from '../../../util/validate-response';


export function userRouter(userHandler: UserHandlerService): Router {
  let router: Router = Router();

  router.post('/signin',
    [body('token').isString().not().isEmpty()],
    handleValidationResult,
    userHandler.createUser.bind(userHandler)
  );

  router.get('/:uid',
    [param('uid').isNumeric().not().isEmpty()],
    handleValidationResult,
    userHandler.getUser.bind(userHandler)
  );

  router.get('/',
    [query('authID').isString().optional()],
    handleValidationResult,
    userHandler.findUser.bind(userHandler)
  );

  return router;
}