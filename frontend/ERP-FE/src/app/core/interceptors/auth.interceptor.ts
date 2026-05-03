import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService, TokenService } from '../../shared/services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  const skipAuth = req.headers.has('x-skip-auth');

  const request = skipAuth
    ? req.clone({ headers: req.headers.delete('x-skip-auth') })
    : req;

  const token = tokenService.getAccessToken();

  const authReq = (!skipAuth && token)
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : request;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (
  error.status !== 401 ||
  skipAuth ||
  req.url.includes('/Auth/Refresh') ||
  req.url.includes('/User/IsLogin')
) {
  return throwError(() => error);
}

      return authService.refreshToken().pipe(
        switchMap((newToken) => {
          const retry = request.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });
          return next(retry);
        }),
        catchError((err) => {
          authService.logout(true);
          return throwError(() => err);
        })
      );
    })
  );
};