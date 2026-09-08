import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRICE_FETCHED_QUEUE, PRICE_QUEUE_CLIENT } from './price-queue.constants';
import { RabbitMqConnectionService } from './rabbitmq-connection.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRICE_QUEUE_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL ??
              'amqp://pricewatch:pricewatch_dev_password@localhost:5672',
          ],
          queue: PRICE_FETCHED_QUEUE,
          queueOptions: {
            durable: true,
          },
          persistent: true,
        },
      },
    ]),
  ],
  providers: [RabbitMqConnectionService],
  exports: [ClientsModule],
})
export class RabbitMqModule {}
