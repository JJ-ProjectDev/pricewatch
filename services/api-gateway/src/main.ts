import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieParser = require('cookie-parser');
import { AppModule } from './app.module';
import { PRICE_FETCHED_QUEUE } from './listings/price-queue.constants';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  });

  setupSwagger(app);

  app.connectMicroservice<MicroserviceOptions>({
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
      noAck: false,
      persistent: true,
      maxConnectionAttempts: -1,
    },
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  Logger.log(`API gateway listening on port ${port}`, 'Bootstrap');

  void app
    .startAllMicroservices()
    .then(() =>
      Logger.log(`Consuming RabbitMQ queue ${PRICE_FETCHED_QUEUE}`, 'Bootstrap'),
    )
    .catch((error: unknown) => {
      const detail = error instanceof Error ? error.message : String(error);
      Logger.error(
        `Unable to start RabbitMQ consumer: ${detail}`,
        undefined,
        'Bootstrap',
      );
    });
}

void bootstrap();
