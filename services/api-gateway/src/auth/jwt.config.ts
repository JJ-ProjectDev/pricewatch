import { JwtModuleOptions } from '@nestjs/jwt';

export const DEFAULT_JWT_EXPIRES_IN = '15m';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    // Fail fast so tokens are never signed with an implicit secret.
    throw new Error('JWT_SECRET is required');
  }

  return secret;
}

export function getJwtModuleOptions(): JwtModuleOptions {
  return {
    secret: getJwtSecret(),
    signOptions: {
      // A short default keeps local auth realistic without extra setup.
      expiresIn: process.env.JWT_EXPIRES_IN ?? DEFAULT_JWT_EXPIRES_IN,
    },
  };
}
