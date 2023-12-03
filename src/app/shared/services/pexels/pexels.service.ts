import { Inject, Injectable } from '@angular/core';
import { MediaOptions, MediaPhoto, MediaServiceConfig } from '../../types';
import { Observable, map } from 'rxjs';
import { MediaService } from '../media/media.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { PaginationParams, Photos, Photo } from 'pexels';
import { AUTH_CONFIG } from '@tokens/api';

@Injectable({
  providedIn: 'root'
})
export class PexelsService extends MediaService {
  private _defaultOptions: MediaOptions & PaginationParams = {
    ...this.defaultQueryOptions,
    page: 1,
    per_page: 1,
  };

  constructor(
    @Inject('MEDIA_SERVICE_CONFIG') _providerConfig: MediaServiceConfig,
    private readonly _http: HttpClient
  ) {
    super(_providerConfig);
  }

  override findPhoto(query: string, options: Partial<MediaOptions> = {}): Observable<MediaPhoto> {
    const queryOptions = { ...this._defaultOptions, ...options };
    const url = this._getPhotosUrl();
    const params = this._composeQueryParams(query, queryOptions);
    const context = new HttpContext().set(AUTH_CONFIG, this._providerConfig.authConfigs);

    return this._http.get<Photos>(url, {
      params,
      context,
      observe: 'response',
    }).pipe(
      map(response => this._composePhotoResponse(response.body as Photos))
    );
  }

  /**
   * Returns the URL for retrieving photos from the Pexels API.
   * @returns The URL string.
   */
  private _getPhotosUrl(): string {
    const url = this._composeUrl('v1/search');

    return url.toString();
  }


  /**
   * Composes a URL with the given pathname.
   * @param pathname - The pathname to be appended to the base URL.
   * @returns The composed URL.
   */
  private _composeUrl(pathname: string): URL {
    const url = new URL(this._providerConfig.baseUrl);
    url.pathname = pathname;
    return url;
  }

  /**
   * Composes the query parameters for the Pexels service.
   * @param query - The search query.
   * @param options - The media options.
   * @returns The composed query parameters.
   */
  private _composeQueryParams(query: string, options: MediaOptions): Record<string, string | number> {
    return {
      query,
      per_page: options.limit.toString(),
      page: options.page.toString(),
      orientation: options.orientation,
      size: options.size,
    };
  }

  /**
   * Composes a photo response object based on the provided response data.
   * @param response - The response data from the Pexels API.
   * @returns The composed photo response object.
   */
  private _composePhotoResponse(response: Photos): MediaPhoto {
    const photo = response.photos[0];

    return {
      url: this._getPhotoUrl(photo),
      alt: photo.alt,
      avgColor: photo.avg_color,
    };
  }

  /**
   * Returns the URL of the photo.
   * @param photo - The photo object.
   * @returns The URL of the photo.
   */
  private _getPhotoUrl(photo: Photo): string {
    switch (this._defaultOptions.size) {
      case 'small':
        return photo.src.small;
      case 'medium':
        return photo.src.medium;
      case 'large':
        return photo.src.large;
      default:
        return photo.src.medium;
    }
  }
}
