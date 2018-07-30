import { Router } from 'express';
import { GroupHandlerService } from '../../service/group-handler.service';
import { body, param } from 'express-validator/check';
import { handleValidationResult } from '../../../util/validate-response';


export function groupRouter(groupHandler: GroupHandlerService): Router {
  let router: Router = Router();

  router.post('/',
    [body('name').isString().not().isEmpty()],
    handleValidationResult,
    groupHandler.createGroup.bind(groupHandler)
  );

  router.get('/:groupid',
    [param('groupid').isNumeric().not().isEmpty()],
    handleValidationResult,
    groupHandler.getGroup.bind(groupHandler)
  );

  return router;
}