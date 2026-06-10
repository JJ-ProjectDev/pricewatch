import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { DEFAULT_JWT_EXPIRES_IN, getJwtModuleOptions } from './jwt.config';

describe('AuthModule', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '30m',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('compiles with Passport and JWT providers', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    expect(moduleRef.get(JwtService)).toBeInstanceOf(JwtService);

    await moduleRef.close();
  });

  it('uses JWT configuration from environment variables', () => {
    expect(getJwtModuleOptions()).toEqual({
      secret: 'test-secret',
      signOptions: {
        expiresIn: '30m',
      },
    });
  });

  it('uses the default JWT expiry when JWT_EXPIRES_IN is not set', () => {
    delete process.env.JWT_EXPIRES_IN;

    expect(getJwtModuleOptions()).toEqual({
      secret: 'test-secret',
      signOptions: {
        expiresIn: DEFAULT_JWT_EXPIRES_IN,
      },
    });
  });
});
