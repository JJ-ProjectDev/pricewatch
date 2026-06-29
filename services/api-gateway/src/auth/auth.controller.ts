import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Get
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthenticatedUser, SafeUser } from './auth.types'
import { LoginResponseDto } from './dto/login-response.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { RegisterUserResponseDto } from './dto/register-user-response.dto'
import { LocalAuthGuard } from './local-auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { JwtAuthGuard } from './jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(
    @Request() request: { user: SafeUser },
    @Body() _dto: LoginUserDto
  ): LoginResponseDto {
    // LocalAuthGuard validates credentials before the handler signs a token.
    return this.authService.login(request.user)
  }

  @Post('register')
  register(@Body() dto: RegisterUserDto): Promise<RegisterUserResponseDto> {
    return this.authService.register(dto)
  }
  // TODO createdAt is not added to the responce, not included in the payload, requires db lookup 
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() request: { user: AuthenticatedUser }) {
    return request.user
  }
}
