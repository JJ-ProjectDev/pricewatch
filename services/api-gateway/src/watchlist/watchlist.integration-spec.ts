import { INestApplication } from '@nestjs/common';
import type { Product } from '@prisma/client';
import * as request from 'supertest';
import { createTestApp, TEST_USER } from '../auth/auth.test-utils';
import { PrismaService } from '../database/prisma.service';

type WatchlistResponse = {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
};

type ProductResponse = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

const OTHER_USER_EMAIL = 'watchlist-tests-other@pricewatch.dev';

describe('Watchlist endpoints', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authenticatedAgent: ReturnType<typeof request.agent>;
  let userId: string;
  let otherUserId: string;
  let productId: string;
  let products: Product[];

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);

    const user = await prisma.user.findUniqueOrThrow({
      where: { email: TEST_USER.email },
    });
    const seededProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'asc' },
      take: 3,
    });

    if (seededProducts.length < 3) {
      throw new Error('Watchlist integration tests require three seeded products');
    }

    const otherUser = await prisma.user.upsert({
      where: { email: OTHER_USER_EMAIL },
      update: { passwordHash: user.passwordHash },
      create: {
        email: OTHER_USER_EMAIL,
        displayName: 'Other Watchlist Test User',
        passwordHash: user.passwordHash,
      },
    });

    userId = user.id;
    otherUserId = otherUser.id;
    products = seededProducts;
    productId = products[0].id;
    authenticatedAgent = request.agent(app.getHttpServer());

    await authenticatedAgent
      .post('/auth/login')
      .send({
        email: TEST_USER.email,
        password: TEST_USER.password,
      })
      .expect(200);
  });

  beforeEach(async () => {
    await prisma.watchlist.deleteMany({
      where: { userId: { in: [userId, otherUserId] } },
    });
  });

  afterAll(async () => {
    await prisma?.watchlist.deleteMany({
      where: { userId: { in: [userId, otherUserId] } },
    });
    await prisma?.user.deleteMany({ where: { email: OTHER_USER_EMAIL } });
    await app?.close();
  });

  it('POST creates a watchlist entry for the authenticated user', async () => {
    const response = await authenticatedAgent
      .post(`/watchlist/${productId}`)
      .expect(201);

    const body = response.body as WatchlistResponse;
    expect(body).toEqual({
      id: expect.any(String),
      userId,
      productId,
      createdAt: expect.any(String),
    });

    await expect(
      prisma.watchlist.findUnique({
        where: {
          userId_productId: { userId, productId },
        },
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        id: body.id,
        userId,
        productId,
      }),
    );
  });

  it('POST ignores a userId supplied in the request body', async () => {
    const response = await authenticatedAgent
      .post(`/watchlist/${productId}`)
      .send({ userId: otherUserId })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        userId,
        productId,
      }),
    );

    await expect(
      prisma.watchlist.findUnique({
        where: {
          userId_productId: { userId: otherUserId, productId },
        },
      }),
    ).resolves.toBeNull();
  });

  it('POST returns 404 when the product does not exist', async () => {
    await authenticatedAgent
      .post('/watchlist/missing-product-id')
      .expect(404);
  });

  it('POST returns 409 when the product is already on the watchlist', async () => {
    await authenticatedAgent.post(`/watchlist/${productId}`).expect(201);
    await authenticatedAgent.post(`/watchlist/${productId}`).expect(409);
  });

  it('POST returns 401 when no authentication cookie is provided', async () => {
    await request(app.getHttpServer())
      .post(`/watchlist/${productId}`)
      .expect(401);
  });

  it('DELETE removes a product from the authenticated user\'s watchlist', async () => {
    const watchlistEntry = await prisma.watchlist.create({
      data: { userId, productId },
    });

    const response = await authenticatedAgent
      .delete(`/watchlist/${productId}`)
      .expect(200);

    expect(response.body).toEqual({
      id: watchlistEntry.id,
      userId,
      productId,
      createdAt: watchlistEntry.createdAt.toISOString(),
    });
    await expect(
      prisma.watchlist.findUnique({
        where: { userId_productId: { userId, productId } },
      }),
    ).resolves.toBeNull();
  });

  it('DELETE returns 404 when the watchlist entry does not exist', async () => {
    await authenticatedAgent.delete(`/watchlist/${productId}`).expect(404);
  });

  it('DELETE cannot remove another user\'s watchlist entry', async () => {
    const otherEntry = await prisma.watchlist.create({
      data: { userId: otherUserId, productId },
    });

    await authenticatedAgent.delete(`/watchlist/${productId}`).expect(404);

    await expect(
      prisma.watchlist.findUnique({
        where: {
          userId_productId: { userId: otherUserId, productId },
        },
      }),
    ).resolves.toEqual(expect.objectContaining({ id: otherEntry.id }));
  });

  it('DELETE returns 401 when no authentication cookie is provided', async () => {
    await request(app.getHttpServer())
      .delete(`/watchlist/${productId}`)
      .expect(401);
  });

  it('GET returns all products on the authenticated user\'s watchlist', async () => {
    await prisma.watchlist.createMany({
      data: [
        {
          userId,
          productId: products[0].id,
          createdAt: new Date('2026-08-28T18:00:00.000Z'),
        },
        {
          userId,
          productId: products[1].id,
          createdAt: new Date('2026-08-28T18:01:00.000Z'),
        },
        {
          userId: otherUserId,
          productId: products[2].id,
          createdAt: new Date('2026-08-28T18:02:00.000Z'),
        },
      ],
    });

    const response = await authenticatedAgent.get('/watchlist').expect(200);
    const body = response.body as ProductResponse[];

    expect(body).toEqual(
      products.slice(0, 2).map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        createdAt: product.createdAt.toISOString(),
      })),
    );
  });

  it('GET returns an empty array when the authenticated user has no watchlist entries', async () => {
    const response = await authenticatedAgent.get('/watchlist').expect(200);

    expect(response.body).toEqual([]);
  });

  it('GET returns 401 when no authentication cookie is provided', async () => {
    await request(app.getHttpServer()).get('/watchlist').expect(401);
  });
});
