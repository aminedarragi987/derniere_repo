import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ResponseLogin } from '../../features/auth/models/auth.models';

const ACCESS_TOKEN_KEY = 'erp.accessToken';
const REFRESH_TOKEN_KEY = 'erp.refreshToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private get storage(): Storage {
    return environment.tokenStorage === 'session' ? sessionStorage : localStorage;
  }

  getAccessToken(): string | null {
    return this.storage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.storage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(tokens: ResponseLogin, rememberMe = true): void {
    const targetStorage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    const accessToken = tokens.AccessToken ?? tokens.accessToken;
    const refreshToken = tokens.RefreshToken ?? tokens.refreshToken;

    otherStorage.removeItem(ACCESS_TOKEN_KEY);
    otherStorage.removeItem(REFRESH_TOKEN_KEY);

    if (accessToken) {
      targetStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } else {
      targetStorage.removeItem(ACCESS_TOKEN_KEY);
    }

    if (refreshToken) {
      targetStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      targetStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  hasValidToken(): boolean {
    return !!this.getAccessToken();
  }
}
