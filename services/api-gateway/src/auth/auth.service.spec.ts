import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PasswordHashingService } from './password-hashing.service';

describe('AuthService', () => {
  const createdAt = new Date('2026-06-07T12:00:00.000Z');

  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
  let passwordHashingService: Pick<PasswordHashingService, 'hash' | 'verify'>;
  let jwtService: Pick<JwtService, 'sign'>;
  let service: AuthService;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    passwordHashingService = {
      hash: jest.fn().mockResolvedValue('$argon2id$hashed-password'),
      verify: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };
    service = new AuthService(
      prisma as never,
      passwordHashingService as PasswordHashingService,
      jwtService as JwtService,
    );
  });

  it('persists a registered user with a password hash', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
      passwordHash: '$argon2id$hashed-password',
      createdAt,
      updatedAt: createdAt,
    });

    const result = await service.register({
      email: 'USER@example.com',
      password: 'StrongPassword123!',
      displayName: 'Example',
    });

    expect(passwordHashingService.hash).toHaveBeenCalledWith('StrongPassword123!');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'user@example.com',
        displayName: 'Example',
        passwordHash: '$argon2id$hashed-password',
      },
    });
    expect(result).toEqual({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
      createdAt,
    });
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('rejects duplicate email registrations', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'existing-user-id',
      email: 'user@example.com',
    });

    await expect(
      service.register({
        email: 'user@example.com',
        password: 'StrongPassword123!',
        displayName: 'Example',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('returns a safe user for valid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
      passwordHash: '$argon2id$hashed-password',
      createdAt,
      updatedAt: createdAt,
    });
    passwordHashingService.verify = jest.fn().mockResolvedValue(true);

    const result = await service.validateUser('USER@example.com', 'StrongPassword123!');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
    });
    expect(passwordHashingService.verify).toHaveBeenCalledWith(
      '$argon2id$hashed-password',
      'StrongPassword123!',
    );
    expect(result).toEqual({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
      createdAt,
    });
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('returns null when the user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.validateUser('missing@example.com', 'StrongPassword123!')).resolves.toBeNull();

    expect(passwordHashingService.verify).not.toHaveBeenCalled();
  });

  it('returns null when the password is invalid', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
      passwordHash: '$argon2id$hashed-password',
      createdAt,
      updatedAt: createdAt,
    });
    passwordHashingService.verify = jest.fn().mockResolvedValue(false);

    await expect(service.validateUser('user@example.com', 'WrongPassword123!')).resolves.toBeNull();
  });

  it('returns a signed access token for a safe user', () => {
    const result = service.login({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
      createdAt,
    });

    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
    });
    expect(result).toEqual({
      accessToken: 'signed-token',
      user: {
        id: 'user-id',
        email: 'user@example.com',
        displayName: 'Example',
      },
    });
    expect(result).not.toHaveProperty('passwordHash');
    expect(result.user).not.toHaveProperty('passwordHash');
  });
});
