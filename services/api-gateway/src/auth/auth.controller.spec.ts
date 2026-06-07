import { ConflictException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: {
    register: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 201 for successful registration without a password hash', async () => {
    authService.register.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
      createdAt: new Date('2026-06-07T12:00:00.000Z'),
    });

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user@example.com',
        password: 'StrongPassword123!',
        displayName: 'Example',
      })
      .expect(201);

    expect(response.body).toEqual({
      id: 'user-id',
      email: 'user@example.com',
      displayName: 'Example',
      createdAt: '2026-06-07T12:00:00.000Z',
    });
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('returns 400 for invalid registration input', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'not-an-email',
        password: 'short',
        displayName: 'Ex',
      })
      .expect(400);

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('returns 409 when an email is already registered', async () => {
    authService.register.mockRejectedValue(new ConflictException('Email already registered'));

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'user@example.com',
        password: 'StrongPassword123!',
        displayName: 'Example',
      })
      .expect(409);
  });
});
