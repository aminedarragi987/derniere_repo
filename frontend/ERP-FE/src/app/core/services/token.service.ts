import { Injectable } from '@angular/core';
import { ResponseLogin } from '../../features/auth/models/auth.models';

const ACCESS_TOKEN_KEY = 'erp.accessToken';
const REFRESH_TOKEN_KEY = 'erp.refreshToken';

@Injectable({ providedIn: 'root' })
export class TokenService {

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
        || sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
        || sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(tokens: ResponseLogin, rememberMe = true): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    this.clearTokens();

    const accessToken = tokens.AccessToken ?? tokens.accessToken;
    const refreshToken = tokens.RefreshToken ?? tokens.refreshToken;

    if (accessToken) {
      storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }

    if (refreshToken) {
      storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  clearTokens(): void {
    [localStorage, sessionStorage].forEach(s => {
      s.removeItem(ACCESS_TOKEN_KEY);
      s.removeItem(REFRESH_TOKEN_KEY);
    });
  }

  hasValidToken(): boolean {
    return !!this.getAccessToken();
  }
}