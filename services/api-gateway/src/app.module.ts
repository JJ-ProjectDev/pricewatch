import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health.controller';
import { ProductsModule } from './products/products.module';
import { WatchlistModule } from './watchlist/watchlist.module';

@Module({
  imports: [DatabaseModule, AuthModule, ProductsModule, WatchlistModule],
  controllers: [HealthController],
})
export class AppModule {}
