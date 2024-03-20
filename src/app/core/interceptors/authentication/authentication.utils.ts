import { HttpHeaders, HttpParams, HttpRequest } from "@angular/common/http";
import { MediaServiceConfig, ApiAuthConfig } from "@shared/types";


/**
   * Sets the authentication information in the request headers or URL parameters based on the provided configuration.
   * 
   * @param config - The authentication configuration.
   * @param request - The request object.
   * @returns A new request object with the updated authentication information.
   */
export function setRequestAuth<T>(req: HttpRequest<T>, authConfigs: MediaServiceConfig['authConfigs']): HttpRequest<T> {;
  const { headers, params } = authConfigs.reduce((acc, curr) => {
    switch (curr.addTo) {
      case 'headers':
        acc.headers = addHeader(acc.headers, curr);
        break;
      case 'params':
        acc.params = addParam(acc.params, curr);
        break;
    }
    return acc;
  }, { headers: req.headers, params: req.params });

  req = req.clone({ headers, params });

  return req
}



/**
 * Adds a header to the given headers object based on the provided configuration.
 * @param headers - The headers object to add the header to.
 * @param config - The configuration object specifying the header details.
 * @returns The updated headers object.
 */
export function addHeader(headers: HttpHeaders, config: Extract<ApiAuthConfig, { addTo: 'headers' }>): HttpHeaders {
  return headers.set(config.key, `${config.authorizationType} ${config.value}`.trim());
}

/**
 * Adds a parameter to the URLSearchParams object.
 * @param params - The URLSearchParams object to add the parameter to.
 * @param config - The configuration object specifying the key and value of the parameter to add.
 * @returns The updated URLSearchParams object.
 */
export function addParam(params: HttpParams, config: Extract<ApiAuthConfig, { addTo: 'params' }>): HttpParams {
  return params.set(config.key, config.value);
}