import { Router } from 'express';
import { GameHandlerService } from '../../service/game-handler.service';
import { body, param } from 'express-validator/check';
import { handleValidationResult } from '../../../util/validate-response';


export function gameRouter(gameHandler: GameHandlerService): Router {
  let router: Router = Router();

  router.post('/',
    [
      body('title_ko').isString().not().isEmpty(),
      body('title_en').isString().not().isEmpty(),
      body('players').isArray(),
      body('players.*').isInt().toInt(),
      body('box.width').isInt().toInt(),
      body('box.height').isInt().toInt(),
      body('box.depth').isInt().toInt(),
      body('setting.width').isInt().toInt(),
      body('setting.height').isInt().toInt(),
    ],
    handleValidationResult,
    gameHandler.createGame.bind(gameHandler)
  );

  router.get('/:gid',
    [param('gid').isNumeric().not().isEmpty()],
    handleValidationResult,
    gameHandler.getGame.bind(gameHandler)
  );

  return router;
}