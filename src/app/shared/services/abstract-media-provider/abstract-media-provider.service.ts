import { Observable } from 'rxjs/internal/Observable';
import { MediaOptions, MediaPhoto, MediaOrientation, MediaServiceConfig, PhotoFinder, MediaProvidersEnum } from '@shared/types';
import { Injectable } from '@angular/core';

/**
 * Abstract class representing a media provider service.
 * It implements the PhotoFinder interface and provides a default implementation for the findPhoto method.
*/
@Injectable({
  providedIn: 'root'
})
export abstract class AbstractMediaProviderService implements PhotoFinder {
  readonly defaultQueryOptions: MediaOptions = {
    page: 1,
    per_page: 10,
    limit: 10,
    orientation: MediaOrientation.LANDSCAPE,
  };

  constructor(protected readonly _providerConfig: MediaServiceConfig) { }

  /**
   * The name of the media provider.
   */
  get providerName(): MediaProvidersEnum {
    return this._providerConfig.provider;
  }

  abstract findPhoto(query: string, options?: Partial<MediaOptions>): Observable<MediaPhoto>;

  /**
   * Composes a URL with the given pathname.
   * @param pathname - The pathname to be appended to the base URL.
   * @returns The composed URL.
   */
  protected composeUrl(pathname: string): URL {
    const url = new URL(this._providerConfig.baseUrl);
    url.pathname = pathname;
    return url;
  }
}
