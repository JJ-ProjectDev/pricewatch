import { randomUUID } from 'node:crypto';
import { Prisma, PrismaClient } from '@prisma/client';

describe('Listing database model', () => {
  const prisma = new PrismaClient();
  let productId: string;
  const fetchedAt = new Date('2026-09-11T12:34:56.789Z');

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    const product = await prisma.product.create({
      data: {
        name: `Listing integration test ${randomUUID()}`,
        description: 'Temporary product for listing database tests',
        imageUrl: 'https://example.com/product.png',
        searchTerm: 'NVIDIA GeForce RTX 4090',
      },
    });
    productId = product.id;
  });

  afterEach(async () => {
    if (productId) {
      // Explicit cleanup also works if the cascade assertion fails.
      await prisma.listing.deleteMany({ where: { productId } });
      await prisma.product.deleteMany({ where: { id: productId } });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function listingData(price = '299.99') {
    return {
      productId,
      price: new Prisma.Decimal(price),
      retailer: 'ebay',
      url: 'https://example.com/listings/test-offer',
      fetchedAt,
    };
  }

  it('allows a product with no listings and preserves its scraper search term', async () => {
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: productId },
      include: { listings: true },
    });

    expect(product.listings).toEqual([]);
    expect(product.searchTerm).toBe('NVIDIA GeForce RTX 4090');
  });

  it.each(['299.99', '0.10', '1234.56789'])(
    'persists the exact decimal price %s and fetch metadata',
    async (price) => {
      const created = await prisma.listing.create({ data: listingData(price) });
      const stored = await prisma.listing.findUniqueOrThrow({
        where: { id: created.id },
        include: { product: true },
      });

      expect(stored.id).toMatch(/^c[a-z0-9]+$/);
      expect(stored.price.equals(new Prisma.Decimal(price))).toBe(true);
      expect(stored.retailer).toBe('ebay');
      expect(stored.url).toBe('https://example.com/listings/test-offer');
      expect(stored.fetchedAt).toEqual(fetchedAt);
      expect(stored.product.id).toBe(productId);
    },
  );

  it('allows multiple observations from the same retailer for a product', async () => {
    const first = await prisma.listing.create({ data: listingData() });
    const second = await prisma.listing.create({
      data: {
        ...listingData('289.99'),
        fetchedAt: new Date('2026-09-12T12:34:56.789Z'),
      },
    });
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: productId },
      include: { listings: { orderBy: { fetchedAt: 'asc' } } },
    });

    expect(product.listings.map((listing) => listing.id)).toEqual([
      first.id,
      second.id,
    ]);
  });

  it('rejects a listing whose product does not exist', async () => {
    await expect(
      prisma.listing.create({
        data: { ...listingData(), productId: `missing-${randomUUID()}` },
      }),
    ).rejects.toMatchObject({ code: 'P2003' });
  });

  it('deletes all associated listings when their product is deleted', async () => {
    await prisma.listing.createMany({
      data: [listingData(), { ...listingData(), retailer: 'amazon' }],
    });
    expect(await prisma.listing.count({ where: { productId } })).toBe(2);

    await prisma.product.delete({ where: { id: productId } });

    expect(await prisma.listing.count({ where: { productId } })).toBe(0);
  });
});
