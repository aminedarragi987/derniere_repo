import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = (route.data?.['roles'] as string[] | undefined) ?? [];

  // Si aucune restriction → accès OK
  if (expectedRoles.length === 0) return true;

  const hasRole = authService.hasAnyRole(expectedRoles);

  if (hasRole) return true;

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url, denied: 'role' }
  });
};