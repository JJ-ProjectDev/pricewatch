import { ConflictException } from '@nestjs/common';
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
  let passwordHashingService: Pick<PasswordHashingService, 'hash'>;
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
    };
    service = new AuthService(prisma as never, passwordHashingService as PasswordHashingService);
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
});
