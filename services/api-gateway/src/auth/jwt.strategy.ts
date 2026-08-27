import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_COOKIE_NAME } from './auth-cookie.config';
import { AuthenticatedUser, JwtPayload } from './auth.types';
import { getJwtSecret } from './jwt.config';

export function extractAccessTokenFromCookie(request: Request): string | null {
  const token = request.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
  return typeof token === 'string' ? token : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractAccessTokenFromCookie,
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    // Passport attaches this safe user object to request.user.
    return {
      id: payload.sub,
      email: payload.email,
      displayName: payload.displayName,
    };
  }
}
