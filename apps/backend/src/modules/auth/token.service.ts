import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AuthPayload } from './auth.types.js';

export class TokenService {
  public createAccessToken(payload: AuthPayload): string {
    const expiresIn = env.JWT_EXPIRES_IN as SignOptions['expiresIn'];
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
  }

  public verifyAccessToken(token: string): AuthPayload {
    return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  }
}
