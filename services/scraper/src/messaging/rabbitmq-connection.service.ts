import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRICE_QUEUE_CLIENT } from './price-queue.constants';

@Injectable()
export class RabbitMqConnectionService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(RabbitMqConnectionService.name);

  constructor(@Inject(PRICE_QUEUE_CLIENT) private readonly client: ClientProxy) {}

  onApplicationBootstrap(): void {
    void this.connect();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.client.close();
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      const detail = this.getErrorMessage(error);
      this.logger.error(
        detail ? `Unable to connect to RabbitMQ: ${detail}` : 'Unable to connect to RabbitMQ',
      );
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message.trim();
    }

    if (typeof error === 'object' && error !== null && 'err' in error) {
      return this.getErrorMessage(error.err);
    }

    return typeof error === 'string' ? error : '';
  }
}
