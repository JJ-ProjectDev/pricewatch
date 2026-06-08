import { MinLength, IsEmail, IsDefined, IsNotEmpty } from 'class-validator'

export class LoginUserDto {
  @IsDefined()
  @IsEmail()
  email!: string

  @IsNotEmpty()
  @MinLength(10)
  password!: string
}
