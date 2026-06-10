import { JwtStrategy } from './jwt.strategy';

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

  it('requires JWT_SECRET for strategy configuration', () => {
    delete process.env.JWT_SECRET;

    expect(() => new JwtStrategy()).toThrow('JWT_SECRET is required');
  });
});
