import { Module } from '@nestjs/common';
import { ListingsConsumer } from './listings.consumer';

@Module({
  controllers: [ListingsConsumer],
})
export class ListingsModule {}
