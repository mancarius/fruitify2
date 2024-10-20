import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { API_BASE_PATHNAME, FRUITYVICE_PROXY_BASE_URL } from '@shared/constants';

/**
 * Interceptor function that modifies the request URL to use a proxy server for requests matching the base URL.
 * @param req - The original HTTP request.
 * @param next - The next interceptor in the chain.
 * @returns The modified HTTP request.
 */
export const fruityviceProxyInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip this interceptor in development mode because of the CORS policy. The proxy server will be used instead.
  if (!environment.production) {
    return next(req);
  }

  const apiPathname = inject(API_BASE_PATHNAME);
  const matchesBaseUrl = req.url.includes(apiPathname);

  if (!matchesBaseUrl) {
    return next(req);
  }

  const url = new URL(inject(FRUITYVICE_PROXY_BASE_URL));
  url.pathname = apiPathname;
  url.protocol = 'https';
  url.port = '';

  req = req.clone({
    url: url.toString()
  });

  return next(req);
};
