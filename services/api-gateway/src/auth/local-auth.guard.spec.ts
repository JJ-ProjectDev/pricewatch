import { LocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  it('uses the local passport strategy', () => {
    expect(new LocalAuthGuard()).toBeDefined();
  });
});
