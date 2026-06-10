import { SafeUser } from '../auth.types';

export class RegisterUserResponseDto implements SafeUser {
  id!: string
  email!: string
  displayName!: string
  createdAt!: Date
}
