import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { createTestApp, TEST_USER } from './auth.test-utils';

describe('Auth Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('returns the user and sets an httpOnly access token cookie', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_USER.email,
          password: TEST_USER.password,
        })
        .expect(200);

      expect(response.body).toEqual({
        user: {
          id: expect.any(String),
          email: TEST_USER.email,
          displayName: TEST_USER.displayName,
        },
      });
      expect(response.body).not.toHaveProperty('accessToken');
      const setCookie = response.headers['set-cookie'] as unknown as string[];
      expect(setCookie).toHaveLength(1);
      expect(setCookie[0]).toMatch(
        /^access_token=eyJ[^;]+; Path=\/; HttpOnly; SameSite=Lax$/,
      );
    });

    it('returns 401 and does not set a cookie when the password is wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_USER.email,
          password: 'this-is-definitely-wrong',
        })
        .expect(401);

      expect(response.headers['set-cookie']).toBeUndefined();
    });

    it('returns 401 when the email does not exist', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'ghost@nowhere.com',
          password: TEST_USER.password,
        })
        .expect(401);
    });

    it.each([
      { email: TEST_USER.email },
      { email: 'not-an-email', password: TEST_USER.password },
      {},
    ])('returns 400 for invalid input %#', async (body) => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(body)
        .expect(400);
    });
  });

  describe('cookie-authenticated session', () => {
    it('uses the login cookie for /auth/me and clears it on logout', async () => {
      const agent = request.agent(app.getHttpServer());

      await agent.post('/auth/login').send({
        email: TEST_USER.email,
        password: TEST_USER.password,
      }).expect(200);

      const profileResponse = await agent.get('/auth/me').expect(200);
      expect(profileResponse.body).toEqual({
        id: expect.any(String),
        email: TEST_USER.email,
        displayName: TEST_USER.displayName,
      });

      await agent.post('/auth/logout').expect(200);
      await agent.get('/auth/me').expect(401);
    });

    it('returns 401 when no authentication cookie is provided', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('returns 401 for an invalid authentication cookie', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', 'access_token=this.is.not.a.real.jwt')
        .expect(401);
    });

    it('returns 401 for an expired authentication cookie', async () => {
      const token = app.get(JwtService).sign(
        {
          sub: 'user-id',
          email: TEST_USER.email,
          displayName: TEST_USER.displayName,
        },
        { expiresIn: -1 },
      );

      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', `access_token=${token}`)
        .expect(401);
    });

    it('does not accept a Bearer token without the cookie', async () => {
      const jwt = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_USER.email,
          password: TEST_USER.password,
        });
      const setCookie = jwt.headers['set-cookie'] as unknown as string[];
      const token = setCookie[0].match(/^access_token=([^;]+)/)?.[1];

      expect(token).toBeDefined();
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });
  });
});
