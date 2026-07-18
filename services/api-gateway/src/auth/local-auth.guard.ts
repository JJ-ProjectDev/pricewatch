import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    // This guard is used only for POST /auth/login.
    //
    // In NestJS, guards run before controller handlers and before the normal
    // ValidationPipe has a chance to validate the request body. Because the
    // Passport local strategy needs email/password immediately, we validate the
    // login DTO here first. Bad request bodies should return 400, not fall
    // through to Passport and look like invalid credentials.
    const request = context.switchToHttp().getRequest<{ body?: unknown }>();

    // Convert the plain JSON body into the DTO class so class-validator can
    // read decorators such as @IsEmail(), @IsNotEmpty(), and @MinLength().
    const dto = plainToInstance(LoginUserDto, request.body ?? {});

    // validateSync is enough here because the current login DTO uses only
    // synchronous validators. whitelist ignores fields that are not part of the
    // DTO, matching the app's global validation behavior.
    const errors = validateSync(dto, { whitelist: true });

    if (errors.length > 0) {
      // Return all validation messages together so callers can fix the request
      // shape before credential checking happens.
      throw new BadRequestException(
        errors.flatMap((error) => Object.values(error.constraints ?? {})),
      );
    }

    // After the request body is shaped correctly, let Passport's "local"
    // strategy call LocalStrategy.validate(email, password). If that succeeds,
    // Passport attaches the safe user object to request.user.
    return super.canActivate(context);
  }
}
