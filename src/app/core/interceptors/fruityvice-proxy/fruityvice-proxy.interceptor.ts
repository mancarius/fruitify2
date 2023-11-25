import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from '@shared/constants';
import { environment } from '@env/environment.development';

/**
 * Interceptor for modifying the request URL to match the Fruityvice API base URL.
 * @param req - The original HTTP request.
 * @param next - The next interceptor in the chain.
 * @returns The modified HTTP request.
 */
export const fruityviceProxyInterceptor: HttpInterceptorFn = (req, next) => {
  const url = new URL(req.url);
  const matchesBaseUrl = url.pathname.includes(API_BASE_URL);

  if (!matchesBaseUrl) {
    return next(req);
  }

  url.hostname = environment.api;
  url.protocol = 'https';
  url.port = '';

  req = req.clone({
    url: url.toString()
  });

  return next(req);
};