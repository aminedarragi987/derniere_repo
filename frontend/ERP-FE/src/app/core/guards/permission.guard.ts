import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedPermissions = (route.data?.['permissions'] as string[] | undefined) ?? [];
  if (!expectedPermissions.length || authService.hasAllPermissions(expectedPermissions)) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url, denied: 'permission' }
  });
};
