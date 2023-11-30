import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_AUTH_CONFIG } from '@tokens/api';

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
  const apiAuthConfig = inject(API_AUTH_CONFIG).getValue();
  const matchesUrl = req.url.includes(apiAuthConfig.match);

  if (!matchesUrl) {
    return next(req);
  }

  if (!apiAuthConfig) {
    throw new HttpErrorResponse({
      status: 401,
      statusText: 'API_AUTH_CONFIG is not set'
    });
  }

  if (apiAuthConfig.addTo === 'headers') {
    req = req.clone({
      headers: req.headers.set(apiAuthConfig.key, `${apiAuthConfig.authorizationType} ${apiAuthConfig.value}`.trim())
    });
  } else if (apiAuthConfig.addTo === 'params') {
    req = req.clone({
      params: req.params.set(apiAuthConfig.key, apiAuthConfig.value.trim())
    });
  }

  return next(req);
};
