import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getJwtModuleOptions } from './jwt.config';
import { PasswordHashingService } from './password-hashing.service';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: getJwtModuleOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordHashingService],
  exports: [AuthService, PasswordHashingService],
})
export class AuthModule {}
