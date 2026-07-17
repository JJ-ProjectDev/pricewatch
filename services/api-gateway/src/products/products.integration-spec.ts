import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from '../auth/auth.test-utils';

type ProductResponse = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  searchTerm?: string;
};

describe('Product Endpoints', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('returns seeded products without internal search terms', async () => {
    const response = await request(app.getHttpServer()).get('/products').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(12);

    const firstProduct = response.body[0] as ProductResponse;

    expect(firstProduct).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        imageUrl: expect.any(String),
        createdAt: expect.any(String),
      }),
    );
    expect(firstProduct).not.toHaveProperty('searchTerm');
  });

  it('returns a single product by id without internal search terms', async () => {
    const listResponse = await request(app.getHttpServer()).get('/products').expect(200);
    const product = (listResponse.body as ProductResponse[])[0];

    const response = await request(app.getHttpServer()).get(`/products/${product.id}`).expect(200);

    expect(response.body).toEqual({
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
    });
    expect(response.body).not.toHaveProperty('searchTerm');
  });

  it('returns 404 for an unknown product id', async () => {
    await request(app.getHttpServer()).get('/products/missing-product-id').expect(404);
  });
});
