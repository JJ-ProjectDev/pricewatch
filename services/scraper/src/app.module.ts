import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { RabbitMqModule } from './messaging/rabbitmq.module';

@Module({
  imports: [RabbitMqModule],
  controllers: [HealthController],
})
export class AppModule {}
