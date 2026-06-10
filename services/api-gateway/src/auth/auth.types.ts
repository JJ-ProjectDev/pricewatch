export interface SafeUser {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  displayName: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}
