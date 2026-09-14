import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PriceFetchedEvent } from './price-fetched-event';
import {
  PRICE_FETCHED_QUEUE,
  PRICE_QUEUE_CLIENT,
} from './price-queue.constants';

@Injectable()
export class PriceQueuePublisher {
  constructor(@Inject(PRICE_QUEUE_CLIENT) private readonly client: ClientProxy) {}

  async publish(event: PriceFetchedEvent): Promise<void> {
    await firstValueFrom(this.client.emit(PRICE_FETCHED_QUEUE, event));
  }
}
