import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Public display name',
    example: 'janedoe',
    minLength: 3,
    maxLength: 12,
  })
  @Length(3, 12)
  displayName!: string;

  @ApiProperty({
    description: 'Unique account email address',
    example: 'jane@example.com',
    format: 'email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Account password',
    example: 'SecurePassword123!',
    minLength: 10,
    maxLength: 25,
    format: 'password',
    writeOnly: true,
  })
  @Length(10, 25)
  password!: string;
}
