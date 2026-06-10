import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { getJwtModuleOptions } from './jwt.config';
import { LocalStrategy } from './local.strategy';
import { PasswordHashingService } from './password-hashing.service';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    // JWT config stays environment-driven so secrets never live in code.
    JwtModule.registerAsync({
      useFactory: getJwtModuleOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordHashingService, LocalStrategy, JwtStrategy],
  exports: [AuthService, PasswordHashingService],
})
export class AuthModule {}
