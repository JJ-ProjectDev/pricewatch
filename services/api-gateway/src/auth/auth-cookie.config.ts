import type { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };
}
