import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { WatchlistResponseDto } from './dto/watchlist-response.dto';

@Injectable()
export class WatchlistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    productId: string,
  ): Promise<WatchlistResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    try {
      const watchlistEntry = await this.prisma.watchlist.create({
        data: {
          userId,
          productId,
        },
      });

      return WatchlistResponseDto.fromWatchlist(watchlistEntry);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Product already on watchlist');
      }

      throw error;
    }
  }
}
