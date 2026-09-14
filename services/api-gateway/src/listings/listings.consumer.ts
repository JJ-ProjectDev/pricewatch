import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PrismaService } from '../database/prisma.service';
import { PriceFetchedMessageDto } from './dto/price-fetched-message.dto';
import { PRICE_FETCHED_QUEUE } from './price-queue.constants';

@Controller()
export class ListingsConsumer {
  private readonly logger = new Logger(ListingsConsumer.name);

  constructor(private readonly prisma: PrismaService) {}

  @EventPattern(PRICE_FETCHED_QUEUE)
  async handlePriceFetched(
    @Payload() payload: unknown,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    const message = await this.toValidMessage(payload);

    if (!message) {
      this.logger.warn('Discarding malformed price.fetched event');
      channel.nack(originalMessage, false, false);
      return;
    }

    try {
      await this.prisma.listing.create({
        data: {
          productId: message.productId,
          price: message.price,
          retailer: message.retailer,
          url: message.url,
          fetchedAt: new Date(message.fetchedAt),
        },
      });

      channel.ack(originalMessage);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      this.logger.error(`Unable to persist price.fetched event: ${detail}`);
      channel.nack(originalMessage, false, true);
    }
  }

  private async toValidMessage(
    payload: unknown,
  ): Promise<PriceFetchedMessageDto | null> {
    if (!this.isRecord(payload)) {
      return null;
    }

    const message = plainToInstance(PriceFetchedMessageDto, payload);
    const errors = await validate(message, {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    });

    return errors.length === 0 ? message : null;
  }

  private isRecord(payload: unknown): payload is Record<string, unknown> {
    return (
      typeof payload === 'object' && payload !== null && !Array.isArray(payload)
    );
  }
}
