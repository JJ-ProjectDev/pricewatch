import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  const safeUser = {
    id: 'user-id',
    email: 'user@example.com',
    displayName: 'Example',
    createdAt: new Date('2026-06-07T12:00:00.000Z'),
  };

  let authService: {
    validateUser: jest.Mock;
  };
  let strategy: LocalStrategy;

  beforeEach(() => {
    authService = {
      validateUser: jest.fn(),
    };
    strategy = new LocalStrategy(authService as unknown as AuthService);
  });

  it('validates email and password using the auth service', async () => {
    authService.validateUser.mockResolvedValue(safeUser);

    await expect(strategy.validate('user@example.com', 'StrongPassword123!')).resolves.toEqual(safeUser);
    expect(authService.validateUser).toHaveBeenCalledWith('user@example.com', 'StrongPassword123!');
  });

  it('throws UnauthorizedException for invalid credentials', async () => {
    authService.validateUser.mockResolvedValue(null);

    await expect(strategy.validate('user@example.com', 'WrongPassword123!')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
