export interface Login {
  Username: string;
  Password: string;
}

export interface ResponseLogin {
  Iduser: number;
  Nom?: string;
  Email?: string;
  Idrole?: number;
  AccessToken?: string;
  TokenType?: string;
  ExpireIn?: number;
  accessToken?: string;
  tokenType?: string;
  expireIn?: number;
  refreshToken?: string;
  RefreshToken?: string;
}

export interface RefreshRequest {
  accessToken: string;
  refreshToken: string;
}

export interface RevokeRequest {
  refreshToken: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
