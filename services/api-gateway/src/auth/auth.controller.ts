import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../common/dto/api-error-response.dto';
import { AuthService } from './auth.service';
import { AuthenticatedUser, SafeUser } from './auth.types';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Log in',
    description: 'Validates credentials and returns a signed JWT.',
  })
  @ApiOkResponse({
    description: 'Login successful.',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'The request body failed validation.',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'The email or password is incorrect.',
    type: ApiErrorResponseDto,
  })
  login(
    @Request() request: { user: SafeUser },
    @Body() _dto: LoginUserDto,
  ): LoginResponseDto {
    // LocalAuthGuard validates credentials before the handler signs a token.
    return this.authService.login(request.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register an account' })
  @ApiCreatedResponse({
    description: 'The account was created.',
    type: RegisterUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'The request body failed validation.',
    type: ApiErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'An account already uses that email address.',
    type: ApiErrorResponseDto,
  })
  register(@Body() dto: RegisterUserDto): Promise<RegisterUserResponseDto> {
    return this.authService.register(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get the authenticated profile' })
  @ApiOkResponse({
    description: 'The authenticated user profile.',
    type: UserProfileResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'The JWT is missing, invalid, or expired.',
    type: ApiErrorResponseDto,
  })
  me(
    @Request() request: { user: AuthenticatedUser },
  ): UserProfileResponseDto {
    return request.user;
  }
}
