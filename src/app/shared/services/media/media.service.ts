import { Injectable, inject } from '@angular/core';
import { PhotoFinder, MediaOrientation, MediaPhoto, MediaOptions, MediaSize, MediaVideo, ApiAuthConfig, MediaServiceConfig } from '../../types';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export abstract class MediaService implements PhotoFinder {
  readonly defaultQueryOptions: MediaOptions = {
    page: 1,
    per_page: 10,
    limit: 10,
    size: MediaSize.MEDIUM,
    orientation: MediaOrientation.LANDSCAPE,
  };

  protected _providerConfig!: MediaServiceConfig;


  constructor(_providerConfig: MediaServiceConfig) {
    this._providerConfig = _providerConfig;
  }


  abstract findPhoto(query: string, options?: Partial<MediaOptions>): Observable<MediaPhoto>;


  /**
   * Composes an HTTP request with the specified method, URL, body, params, and headers.
   * 
   * @template T - The type of the request body.
   * @param method - The HTTP method (GET, POST, PUT, DELETE).
   * @param url - The URL for the HTTP request.
   * @param body - The request body (optional).
   * @param params - The request parameters (optional).
   * @param headers - The request headers (optional).
   * @returns The composed HttpRequest object.
   */
  protected composeHttpRequest<T = any>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, body?: T, params?: HttpParams, headers?: HttpHeaders): HttpRequest<T> {
    const request = new HttpRequest<T>(method, url, body ?? null, { params, headers });
    const reqWithAuth = this.setRequestAuth(request, this._providerConfig.authConfigs);
    return reqWithAuth;
  }

  /**
   * Sets the authentication information in the request headers or URL parameters based on the provided configuration.
   * 
   * @param config - The authentication configuration.
   * @param request - The request object.
   * @returns A new request object with the updated authentication information.
   */
  protected setRequestAuth<T>(request: HttpRequest<T>, authConfigs: MediaServiceConfig['authConfigs']): HttpRequest<T> {
    const req = request.clone();

    authConfigs.forEach(authConfig => {
      switch (authConfig.addTo) {
        case 'headers':
          this._addHeader(req.headers, authConfig);
          break;
        case 'params':
          this._addParam(req.params, authConfig);
          break;
      }
    });

    return req;
  }

  /**
   * Adds a header to the given headers object based on the provided configuration.
   * @param headers - The headers object to add the header to.
   * @param config - The configuration object specifying the header details.
   * @returns The updated headers object.
   */
  private _addHeader(headers: HttpHeaders, config: Extract<ApiAuthConfig, { addTo: 'headers' }>): HttpHeaders {
    headers.append(config.key, `${config.authorizationType} ${config.value}`.trim());
    return headers;
  }

  /**
   * Adds a parameter to the URLSearchParams object.
   * @param params - The URLSearchParams object to add the parameter to.
   * @param config - The configuration object specifying the key and value of the parameter to add.
   * @returns The updated URLSearchParams object.
   */
  private _addParam(params: HttpParams, config: Extract<ApiAuthConfig, { addTo: 'params' }>): HttpParams {
    params.append(config.key, config.value);
    return params;
  }
}