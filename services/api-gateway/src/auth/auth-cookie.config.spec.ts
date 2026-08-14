import {
  ACCESS_TOKEN_COOKIE_NAME,
  getAuthCookieOptions,
} from './auth-cookie.config';

describe('auth cookie configuration', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('uses a consistent access token cookie name', () => {
    expect(ACCESS_TOKEN_COOKIE_NAME).toBe('access_token');
  });

  it('uses httpOnly same-site cookies during local development', () => {
    process.env.NODE_ENV = 'development';

    expect(getAuthCookieOptions()).toEqual({
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });
  });

  it('requires HTTPS cookies in production', () => {
    process.env.NODE_ENV = 'production';

    expect(getAuthCookieOptions()).toEqual({
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });
  });
});
