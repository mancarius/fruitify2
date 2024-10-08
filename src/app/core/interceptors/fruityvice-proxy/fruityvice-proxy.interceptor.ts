import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_PATHNAME, FRUITYVICE_PROXY_BASE_URL } from '@shared/constants';

/**
 * Interceptor function that modifies the request URL to use a proxy server for requests matching the base URL.
 * @param req - The original HTTP request.
 * @param next - The next interceptor in the chain.
 * @returns The modified HTTP request.
 */
export const fruityviceProxyInterceptor: HttpInterceptorFn = (req, next) => {
  const url = new URL(req.url);
  const matchesBaseUrl = url.pathname.includes(API_BASE_PATHNAME);

  if (!matchesBaseUrl) {
    return next(req);
  }

  url.hostname = FRUITYVICE_PROXY_BASE_URL;
  url.protocol = 'https';
  url.port = '';

  req = req.clone({
    url: url.toString()
  });

  return next(req);
};