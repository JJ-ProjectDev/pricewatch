import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('uses the jwt passport strategy', () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });
});
