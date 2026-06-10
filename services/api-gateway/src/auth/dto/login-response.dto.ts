import { AuthenticatedUser } from '../auth.types';

export class LoginResponseDto {
  accessToken!: string;
  user!: AuthenticatedUser;
}
