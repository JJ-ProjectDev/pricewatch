import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

/**
 * Boots a full NestJS application instance for integration testing.
 * Returns the app so Supertest can send real HTTP requests through it.
 *
 * Using the real AppModule means Passport, JWT, and all your guards
 * are active — you are testing the actual auth flow, not a mock.
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Mirror exactly what your main.ts does so validation behaves identically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown fields
      forbidNonWhitelisted: true,
      transform: true,       // auto-convert payloads to DTO class instances
    }),
  );

  await app.init();
  return app;
}

/**
 * Seed credentials that match a real user in your test database.
 * Change these to match a user you have seeded in your test DB.
 */
export const TEST_USER = {
  email: 'testuser@pricewatch.dev',
  password: 'Password123!',
  displayName: 'Test User',
};