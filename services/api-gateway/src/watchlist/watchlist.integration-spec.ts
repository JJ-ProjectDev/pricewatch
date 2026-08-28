import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp, TEST_USER } from '../auth/auth.test-utils';
import { PrismaService } from '../database/prisma.service';

type WatchlistResponse = {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
};

describe('POST /watchlist/:productId', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authenticatedAgent: ReturnType<typeof request.agent>;
  let userId: string;
  let productId: string;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);

    const user = await prisma.user.findUniqueOrThrow({
      where: { email: TEST_USER.email },
    });
    const product = await prisma.product.findFirstOrThrow({
      orderBy: { createdAt: 'asc' },
    });

    userId = user.id;
    productId = product.id;
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
    await prisma.watchlist.deleteMany({ where: { userId } });
  });

  afterAll(async () => {
    await prisma?.watchlist.deleteMany({ where: { userId } });
    await app?.close();
  });

  it('creates a watchlist entry for the authenticated user', async () => {
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

  it('ignores a userId supplied in the request body', async () => {
    const response = await authenticatedAgent
      .post(`/watchlist/${productId}`)
      .send({ userId: 'another-user-id' })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        userId,
        productId,
      }),
    );
  });

  it('returns 404 when the product does not exist', async () => {
    await authenticatedAgent
      .post('/watchlist/missing-product-id')
      .expect(404);
  });

  it('returns 409 when the product is already on the watchlist', async () => {
    await authenticatedAgent.post(`/watchlist/${productId}`).expect(201);
    await authenticatedAgent.post(`/watchlist/${productId}`).expect(409);
  });

  it('returns 401 when no authentication cookie is provided', async () => {
    await request(app.getHttpServer())
      .post(`/watchlist/${productId}`)
      .expect(401);
  });
});
