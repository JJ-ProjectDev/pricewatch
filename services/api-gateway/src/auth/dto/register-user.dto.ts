import { Length, IsEmail } from 'class-validator'

export class RegisterUserDto {
  @Length(3, 12)
  displayName!: string

  @IsEmail()
  email!: string

  @Length(10, 25)
  password!: string
}
