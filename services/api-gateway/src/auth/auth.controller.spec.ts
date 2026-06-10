import {
  ConflictException,
  INestApplication,
  UnauthorizedException,
  ValidationPipe
} from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'

describe('AuthController', () => {
  const safeUser = {
    id: 'user-id',
    email: 'user@example.com',
    displayName: 'Example',
    createdAt: new Date('2026-06-07T12:00:00.000Z')
  }

  let app: INestApplication
  let authService: {
    register: jest.Mock
    login: jest.Mock
    validateUser: jest.Mock
  }

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      validateUser: jest.fn()
    }

    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        LocalStrategy
      ]
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true
      })
    )
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  it('returns 201 for successful registration without a password hash', async () => {
    authService.register.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
      createdAt: new Date('2026-06-07T12:00:00.000Z')
    })

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user@example.com',
        password: 'StrongPassword123!',
        displayName: 'Example'
      })
      .expect(201)

    expect(response.body).toEqual({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
      createdAt: '2026-06-07T12:00:00.000Z'
    })
    expect(response.body).not.toHaveProperty('passwordHash')
  })

  it('returns 400 for missing password', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user@example.com',
        // no password
        displayName: 'usertest'
      })
      .expect(400)

    expect(authService.register).not.toHaveBeenCalled()
  })

  it('returns 400 for invalid registration input', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'not-an-email',
        password: 'short',
        displayName: 'Ex'
      })
      .expect(400)

    expect(authService.register).not.toHaveBeenCalled()
  })

  it('returns 200 and an access token for successful login', async () => {
    authService.validateUser.mockResolvedValue(safeUser)
    authService.login.mockReturnValue({
      accessToken: 'signed-token',
      user: {
        id: 'user-id',
        email: 'user@example.com',
        displayName: 'Example'
      }
    })

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@example.com',
        password: 'StrongPassword123!'
      })
      .expect(200)

    expect(authService.validateUser).toHaveBeenCalledWith(
      'user@example.com',
      'StrongPassword123!'
    )
    expect(authService.login).toHaveBeenCalledWith(safeUser)
    expect(response.body).toEqual({
      accessToken: 'signed-token',
      user: {
        id: 'user-id',
        email: 'user@example.com',
        displayName: 'Example'
      }
    })
    expect(response.body).not.toHaveProperty('passwordHash')
    expect(response.body.user).not.toHaveProperty('passwordHash')
  })

  it('returns 401 for an invalid password', async () => {
    authService.validateUser.mockResolvedValue(null)

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@example.com',
        password: 'WrongPassword123!'
      })
      .expect(401)
  })

  it('returns 401 for a non-existent email', async () => {
    authService.validateUser.mockResolvedValue(null)

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'missing@example.com',
        password: 'StrongPassword123!'
      })
      .expect(401)
  })

  it('returns 400 for missing login fields', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@example.com'
      })
      .expect(400)

    expect(authService.validateUser).not.toHaveBeenCalled()
    expect(authService.login).not.toHaveBeenCalled()
  })

  it('does not call the login handler when local auth fails', async () => {
    authService.validateUser.mockRejectedValue(
      new UnauthorizedException('Invalid credentials')
    )

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@example.com',
        password: 'WrongPassword123!'
      })
      .expect(401)

    expect(authService.login).not.toHaveBeenCalled()
  })

  it('returns 409 when an email is already registered', async () => {
    authService.register.mockRejectedValue(
      new ConflictException('Email already registered')
    )

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user@example.com',
        password: 'StrongPassword123!',
        displayName: 'Example'
      })
      .expect(409)
  })
})
