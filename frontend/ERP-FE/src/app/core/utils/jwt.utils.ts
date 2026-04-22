import { AuthUserState } from '../../features/auth/models/user.models';

type JwtClaims = Record<string, unknown>;

export function decodeJwtClaims(token: string): JwtClaims {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === 'string') {
    return [value];
  }

  return [];
}

export function normalizeUserFromClaims(claims: JwtClaims): AuthUserState {
  const roleKeys = [
    'role',
    'roles',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
  ];
  const permissionKeys = ['permission', 'permissions', 'perm'];

  const roles = roleKeys.flatMap((key) => toArray(claims[key]));
  const permissions = permissionKeys.flatMap((key) => toArray(claims[key]));

  return {
    id: (claims['sub'] as string) ?? undefined,
    userName: (claims['unique_name'] as string) ?? (claims['name'] as string) ?? undefined,
    email: (claims['email'] as string) ?? undefined,
    nom: (claims['name'] as string) ?? undefined,
    profile: (claims['profile'] as string) ?? undefined,
    roles: [...new Set(roles)],
    permissions: [...new Set(permissions)],
    claims: claims as Record<string, string | string[]>
  };
}
