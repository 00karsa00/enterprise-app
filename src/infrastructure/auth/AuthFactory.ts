/**
 * Auth Factory.
 *
 * Switch providers by changing VITE_AUTH_PROVIDER in .env.
 * Zero feature module changes required.
 */
import { env } from '@core/config/env';

import type { IAuthService } from './IAuthService';
import { JwtAuthService } from './JwtAuthService';

export class AuthFactory {
  static create(): IAuthService {
    switch (env.VITE_AUTH_PROVIDER) {
      case 'jwt':
      default:
        return new JwtAuthService();
      // case 'keycloak': return new KeycloakAuthService();
      // case 'oauth': return new OAuthService();
      // case 'firebase': return new FirebaseAuthService();
    }
  }
}

/** Application-wide auth service singleton */
export const authService = AuthFactory.create();
