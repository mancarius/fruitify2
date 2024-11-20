import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { API_BASE_PATHNAME, FRUITYVICE_PROXY_BASE_URL } from '@shared/constants';

/**
 * Modifies the given request URL to use the hostname, protocol, and port of the proxy base URL.
 *
 * @param reqUrl - The original request URL to be modified.
 * @param proxyBaseUrl - The base URL of the proxy server.
 * @returns The modified URL as a string.
 */
const modifyUrlForProxy = (reqUrl: string, proxyBaseUrl: string): string => {
  const proxyUrl = new URL(proxyBaseUrl);
  const url = new URL(reqUrl);

  url.hostname = proxyUrl.hostname;
  url.protocol = proxyUrl.protocol;
  url.port = proxyUrl.port;

  return url.toString();
};


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

  try {
    const apiPathname = inject(API_BASE_PATHNAME);
    const matchesBaseUrl = req.url.includes(apiPathname);

    if (!matchesBaseUrl) {
      return next(req);
    }

    const proxyBaseUrl = inject(FRUITYVICE_PROXY_BASE_URL);
    const modifiedUrl = modifyUrlForProxy(req.url, proxyBaseUrl);

    req = req.clone({ url: modifiedUrl });
  } catch (error) {
    console.error('Error in fruityviceProxyInterceptor:', error);
    return next(req);
  }

  return next(req);
};
