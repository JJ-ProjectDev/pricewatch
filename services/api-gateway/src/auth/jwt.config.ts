import { JwtModuleOptions } from '@nestjs/jwt';

export const DEFAULT_JWT_EXPIRES_IN = '15m';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }

  return secret;
}

export function getJwtModuleOptions(): JwtModuleOptions {
  return {
    secret: getJwtSecret(),
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN ?? DEFAULT_JWT_EXPIRES_IN,
    },
  };
}
