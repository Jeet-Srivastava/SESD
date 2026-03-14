import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';
import { TokenService } from '../../modules/auth/token.service.js';
import { AuthPayload } from '../../modules/auth/auth.types.js';
import { UserRole } from '../types/roles.js';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

const tokenService = new TokenService();

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authorization = req.header('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const token = authorization.replace('Bearer ', '').trim();
  req.auth = tokenService.verifyAccessToken(token);
  next();
};

export const requireRoles = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    if (!roles.includes(req.auth.role)) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    next();
  };
};
