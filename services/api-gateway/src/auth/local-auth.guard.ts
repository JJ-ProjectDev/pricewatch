import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ body?: unknown }>();
    const dto = plainToInstance(LoginUserDto, request.body ?? {});
    const errors = validateSync(dto, { whitelist: true });

    if (errors.length > 0) {
      throw new BadRequestException(
        errors.flatMap((error) => Object.values(error.constraints ?? {})),
      );
    }

    return super.canActivate(context);
  }
}
