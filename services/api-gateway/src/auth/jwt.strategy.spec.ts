import { Request } from 'express';
import {
  extractAccessTokenFromCookie,
  JwtStrategy,
} from './jwt.strategy';

describe('JwtStrategy', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test-secret',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('extracts the authenticated user from the token payload', () => {
    const strategy = new JwtStrategy();

    expect(
      strategy.validate({
        sub: 'user-id',
        email: 'user@example.com',
        displayName: 'Example',
      }),
    ).toEqual({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
    });
  });

  it('extracts the access token from the authentication cookie', () => {
    const request = {
      cookies: { access_token: 'signed-token' },
    } as unknown as Request;

    expect(extractAccessTokenFromCookie(request)).toBe('signed-token');
  });

  it('does not extract a token from an Authorization header', () => {
    const request = {
      cookies: {},
      headers: { authorization: 'Bearer signed-token' },
    } as unknown as Request;

    expect(extractAccessTokenFromCookie(request)).toBeNull();
  });

  it('requires JWT_SECRET for strategy configuration', () => {
    delete process.env.JWT_SECRET;

    expect(() => new JwtStrategy()).toThrow('JWT_SECRET is required');
  });
});
