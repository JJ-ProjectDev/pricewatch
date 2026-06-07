import { PasswordHashingService } from './password-hashing.service';

describe('PasswordHashingService', () => {
  let service: PasswordHashingService;

  beforeEach(() => {
    service = new PasswordHashingService();
  });

  it('hashes plaintext passwords before storage', async () => {
    const password = 'StrongPassword123!';

    const hash = await service.hash(password);

    expect(hash).not.toBe(password);
    expect(hash).toContain('argon2id');
  });

  it('verifies the correct password against a hash', async () => {
    const password = 'StrongPassword123!';
    const hash = await service.hash(password);

    await expect(service.verify(hash, password)).resolves.toBe(true);
  });

  it('rejects an incorrect password against a hash', async () => {
    const hash = await service.hash('StrongPassword123!');

    await expect(service.verify(hash, 'WrongPassword123!')).resolves.toBe(false);
  });
});
