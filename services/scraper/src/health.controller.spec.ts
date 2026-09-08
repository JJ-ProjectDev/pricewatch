import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('identifies the scraper service as available', () => {
    const controller = new HealthController();

    expect(controller.getHealth()).toEqual({
      status: 'ok',
      service: 'scraper',
    });
  });
});
