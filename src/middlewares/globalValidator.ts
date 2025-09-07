import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export class Globalvalidator {
  rules: { [key: string]: any[] };

  constructor(rules: { [key: string]: any[] }) {
    this.rules = rules;
  }

  makeValidation(key: string) {
    if (!key || !this.rules[key]) {
      throw new Error(`Invalid validator key '${key}' supplied.`);
    }

    return async (req: Request, res: Response, next: NextFunction) => {
      for (const validation of this.rules[key]) {
        await validation.run(req);
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    };
  }
}

