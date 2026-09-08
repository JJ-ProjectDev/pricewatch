import { Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMqConnectionService } from './rabbitmq-connection.service';

describe('RabbitMqConnectionService', () => {
  const flushPromises = () => new Promise<void>((resolve) => setImmediate(resolve));

  let client: jest.Mocked<Pick<ClientProxy, 'connect' | 'close'>>;
  let service: RabbitMqConnectionService;

  beforeEach(() => {
    client = {
      connect: jest.fn(),
      close: jest.fn(),
    };
    service = new RabbitMqConnectionService(client as unknown as ClientProxy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('connects to RabbitMQ during application bootstrap', async () => {
    client.connect.mockResolvedValue(undefined);
    jest.spyOn(Logger.prototype, 'log').mockImplementation();

    service.onApplicationBootstrap();
    await flushPromises();

    expect(client.connect).toHaveBeenCalledTimes(1);
  });

  it('logs a failed connection without rejecting application bootstrap', async () => {
    client.connect.mockRejectedValue(new Error('broker unavailable'));
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    expect(service.onApplicationBootstrap()).toBeUndefined();
    await flushPromises();

    expect(errorSpy).toHaveBeenCalledWith(
      'Unable to connect to RabbitMQ: broker unavailable',
    );
  });

  it('closes the RabbitMQ client during application shutdown', async () => {
    client.close.mockResolvedValue(undefined);

    await service.onApplicationShutdown();

    expect(client.close).toHaveBeenCalledTimes(1);
  });
});
