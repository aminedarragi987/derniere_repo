import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  const skipAuth = req.headers.has('x-skip-auth');
  const cleanRequest = skipAuth
    ? req.clone({ headers: req.headers.delete('x-skip-auth') })
    : req;

  const accessToken = tokenService.getAccessToken();
  const requestWithAuth = !skipAuth && accessToken
    ? cleanRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    : cleanRequest;

  return next(requestWithAuth).pipe(
    catchError((error: HttpErrorResponse) => {
      const is401 = error.status === 401;
      const isRefreshRequest = cleanRequest.url.includes('/refresh');
      const isLoginRequest = cleanRequest.url.includes('/login');

      if (!is401 || skipAuth || isRefreshRequest || isLoginRequest) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap((newToken) => {
          const retried = cleanRequest.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });
          return next(retried);
        }),
        catchError((refreshError) => {
          authService.logout(true);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
