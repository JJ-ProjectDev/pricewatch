import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Registered account email address',
    example: 'testuser@pricewatch.dev',
    format: 'email',
  })
  @IsDefined()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Account password',
    example: 'Password123!',
    minLength: 10,
    format: 'password',
    writeOnly: true,
  })
  @IsNotEmpty()
  @MinLength(10)
  password!: string;
}
