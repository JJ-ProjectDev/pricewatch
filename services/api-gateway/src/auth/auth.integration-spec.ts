import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { createTestApp, TEST_USER } from './auth.test-utils'

// ---------------------------------------------------------------------------
// Test Suite: Authentication Endpoints
// Issue #23 — PriceWatch
// ---------------------------------------------------------------------------

describe('Auth Integration Tests', () => {
  let app: INestApplication

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * beforeAll runs ONCE before any test in this file.
   * Booting NestJS is slow (~1-2s), so we do it once and reuse the instance
   * across all tests rather than restarting for each one.
   */
  beforeAll(async () => {
    app = await createTestApp()
  })

  /**
   * afterAll runs ONCE after every test has finished.
   * Closes the HTTP server so Jest can exit cleanly.
   */
  afterAll(async () => {
    await app.close()
  })

  // ── POST /auth/login ───────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    // ── Acceptance Criterion 1: Successful login ───────────────────────────
    it('should return 200 and an access_token on valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_USER.email,
          password: TEST_USER.password
        })

      // HTTP status must be 200
      expect(response.status).toBe(200)

      // Body must contain accessToken as a non-empty string
      expect(response.body).toHaveProperty('accessToken')
      expect(typeof response.body.accessToken).toBe('string')
      expect(response.body.accessToken.length).toBeGreaterThan(0)
    })

    // ── Acceptance Criterion 2: Invalid password ───────────────────────────
    it('should return 401 when the password is wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_USER.email,
          password: 'this-is-definitely-wrong'
        })

      expect(response.status).toBe(401)
    })

    // ── Acceptance Criterion 3: Non-existent email ─────────────────────────
    it('should return 401 when the email does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'ghost@nowhere.com',
          password: TEST_USER.password
        })

      // NestJS Passport returns 401 for unknown users, not 404.
      // Returning 404 would reveal that an email is unregistered — a security leak.
      expect(response.status).toBe(401)
    })

    // ── Acceptance Criterion 4a: Missing password ──────────────────────────
    it('should return 400 when password is missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_USER.email
          // password intentionally omitted
        })

      expect(response.status).toBe(400)
    })

    // ── Acceptance Criterion 4b: Invalid email format ──────────────────────
    it('should return 400 when email is not a valid email address', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'not-an-email',
          password: TEST_USER.password
        })

      expect(response.status).toBe(400)
    })

    // ── Acceptance Criterion 4c: Empty body ───────────────────────────────
    it('should return 400 when the request body is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({})

      expect(response.status).toBe(400)
    })
  })

  // ── GET /auth/me ───────────────────────────────────────────────────────────

  describe('GET /auth/me', () => {
    /**
     * We need a valid JWT for the protected-route tests.
     * We get one by logging in first, then store it here to reuse.
     */
    let validToken: string

    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: TEST_USER.email,
          password: TEST_USER.password
        })

      // Pull the token out of the login response
      validToken = loginResponse.body.accessToken
    })

    // ── Acceptance Criterion 5: Protected route with valid token ───────────
    it('should return 200 and user profile when a valid Bearer token is supplied', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        // The Authorization header is exactly what your JwtAuthGuard reads
        .set('Authorization', `Bearer ${validToken}`)

      expect(response.status).toBe(200)

      // Check that the user shape matches the spec
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('email', TEST_USER.email)
      expect(response.body).toHaveProperty('displayName')
    })

    // ── Acceptance Criterion 6: Protected route without token ──────────────
    it('should return 401 when no Authorization header is provided', async () => {
      const response = await request(app.getHttpServer()).get('/auth/me')
      // No .set('Authorization', ...) — deliberately omitted

      expect(response.status).toBe(401)
    })

    // ── Bonus: Malformed / expired token ──────────────────────────────────
    it('should return 401 when an invalid token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer this.is.not.a.real.jwt')

      expect(response.status).toBe(401)
    })
  })
})
