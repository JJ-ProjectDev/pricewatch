import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WatchlistService } from './watchlist.service';

describe('WatchlistService', () => {
  const createdAt = new Date('2026-08-27T18:00:00.000Z');

  let prisma: {
    product: {
      findUnique: jest.Mock;
    };
    watchlist: {
      create: jest.Mock;
    };
  };
  let service: WatchlistService;

  beforeEach(() => {
    prisma = {
      product: {
        findUnique: jest.fn(),
      },
      watchlist: {
        create: jest.fn(),
      },
    };
    service = new WatchlistService(prisma as never);
  });

  it('creates a watchlist entry for an existing product', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'product-id' });
    prisma.watchlist.create.mockResolvedValue({
      id: 'watchlist-id',
      userId: 'user-id',
      productId: 'product-id',
      createdAt,
      internalField: 'not-public',
    });

    const result = await service.create('user-id', 'product-id');

    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: 'product-id' },
      select: { id: true },
    });
    expect(prisma.watchlist.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-id',
        productId: 'product-id',
      },
    });
    expect(result).toEqual({
      id: 'watchlist-id',
      userId: 'user-id',
      productId: 'product-id',
      createdAt,
    });
    expect(result).not.toHaveProperty('internalField');
  });

  it('rejects an unknown product before creating an entry', async () => {
    prisma.product.findUnique.mockResolvedValue(null);

    await expect(
      service.create('user-id', 'missing-product-id'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.watchlist.create).not.toHaveBeenCalled();
  });

  it('returns a conflict when the product is already on the watchlist', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'product-id' });
    prisma.watchlist.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: Prisma.prismaVersion.client,
        meta: { target: ['userId', 'productId'] },
      }),
    );

    await expect(
      service.create('user-id', 'product-id'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('does not hide unexpected database errors', async () => {
    const databaseError = new Error('Database unavailable');
    prisma.product.findUnique.mockResolvedValue({ id: 'product-id' });
    prisma.watchlist.create.mockRejectedValue(databaseError);

    await expect(
      service.create('user-id', 'product-id'),
    ).rejects.toBe(databaseError);
  });
});
