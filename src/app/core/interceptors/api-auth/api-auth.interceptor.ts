import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_AUTH_CONFIG } from '../../../tokens';

/**
 * Interceptor function for API authentication.
 * 
 * Adds authentication information to the outgoing HTTP requests based on the API_AUTH_CONFIG.
 *
 * @param req - The outgoing HTTP request.
 * @param next - The next interceptor in the chain.
 * @returns The modified HTTP request.
 */
export const apiAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const apiAuthConfig = inject(API_AUTH_CONFIG);

  if (apiAuthConfig) {
    const { addTo, key, authorizationType, value } = apiAuthConfig;

    if (addTo === 'headers') {
      req = req.clone({
        headers: req.headers.set(key, `${authorizationType} ${value}`.trim())
      });
    } else if (addTo === 'params') {
      req = req.clone({
        params: req.params.set(key, value.trim())
      });
    }
  }

  return next(req);
};
