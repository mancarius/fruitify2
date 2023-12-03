import { HttpInterceptorFn } from '@angular/common/http';
import { setRequestAuth } from './authentication.utils';
import { AUTH_CONFIG } from '@tokens/api';

/**
 * Interceptor function for handling authentication in HTTP requests based on the provided configuration.
 * @param req The HTTP request.
 * @param next The next interceptor in the chain.
 * @returns The modified HTTP request with authentication information.
 */
export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const config = req.context.get(AUTH_CONFIG);
  return next(config ? setRequestAuth(req, config) : req);
};
