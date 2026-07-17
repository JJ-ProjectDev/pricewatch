import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [DatabaseModule, AuthModule, ProductsModule],
  controllers: [HealthController],
})
export class AppModule {}
