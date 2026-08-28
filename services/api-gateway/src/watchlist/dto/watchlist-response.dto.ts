import { Watchlist } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class WatchlistResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the watchlist entry.',
    example: 'cm123watchlistentry',
  })
  id!: string;

  @ApiProperty({
    description: 'The unique identifier of the user who owns the entry.',
    example: 'e9ec9a64-a1fe-48c1-9d1e-513dc9d763ee',
    format: 'uuid',
  })
  userId!: string;

  @ApiProperty({
    description: 'The unique identifier of the watched product.',
    example: 'cmrqetpqv0000pa4gf6oymc3t',
  })
  productId!: string;

  @ApiProperty({
    example: '2026-08-27T18:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  static fromWatchlist(watchlist: Watchlist): WatchlistResponseDto {
    return {
      id: watchlist.id,
      userId: watchlist.userId,
      productId: watchlist.productId,
      createdAt: watchlist.createdAt,
    };
  }
}
