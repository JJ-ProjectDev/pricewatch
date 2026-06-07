import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { PasswordHashingService } from './password-hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async register(dto: RegisterUserDto): Promise<RegisterUserResponseDto> {
    const email = dto.email.toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.passwordHashingService.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          displayName: dto.displayName,
          passwordHash,
        },
      });

      return {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }

      throw error;
    }
  }
}
