import { validationResult } from 'express-validator/check';
import { Request, Response, NextFunction} from 'express';

export function handleValidationResult(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (false === errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    next();
  }
};