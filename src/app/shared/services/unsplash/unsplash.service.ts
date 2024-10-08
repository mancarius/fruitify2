import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { MediaOptions, MediaPhoto, MediaServiceConfig, Unsplash } from '@shared/types';
import { Observable, map } from 'rxjs';
import { AUTH_CONFIG_CONTEXT_TOKEN, MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';
import { AbstractMediaProviderService } from '../abstract-media-provider/abstract-media-provider.service';


@Injectable({
  providedIn: 'root'
})
export class UnsplashService extends AbstractMediaProviderService {
  private readonly _defaultOptions: MediaOptions = {
    ...this.defaultQueryOptions,
    page: 1,
    per_page: 1,
  };

  constructor(
    @Inject(MEDIA_SERVICE_CONFIG_TOKEN) _providerConfig: MediaServiceConfig,
    private readonly _http: HttpClient
  ) {
    super(_providerConfig);
  }

  override findPhoto(query: string, options: Partial<MediaOptions> = {}): Observable<MediaPhoto> {
    const queryOptions = { ...this._defaultOptions, ...options };
    const url = this._getPhotosUrl();
    const params = this._composeQueryParams(query, queryOptions);
    const context = new HttpContext().set(AUTH_CONFIG_CONTEXT_TOKEN, this._providerConfig.authConfigs);

    return this._http.get<Unsplash.Photos>(url, {
      params,
      context,
      observe: 'response',
    }).pipe(
      map(response => this._composePhotoResponse(response.body as Unsplash.Photos))
    );
  }

  /**
   * Returns the URL for retrieving photos from the Pexels API.
   * @returns The URL string.
   */
  private _getPhotosUrl(): string {
    const url = this.composeUrl('search/photos');

    return url.toString();
  }

  /**
   * Composes the query parameters for the Pexels service.
   * @param query - The search query.
   * @param options - The media options.
   * @returns The composed query parameters.
   */
  private _composeQueryParams(query: string, options: MediaOptions): HttpParams {
    return new HttpParams({
      fromObject: {
        query,
        per_page: options.limit.toString(),
        page: options.page.toString(),
        orientation: options.orientation
      }
    });
  }

  /**
   * Composes a photo response object based on the provided response data.
   * @param response - The response data from the Pexels API.
   * @returns The composed photo response object.
   */
  private _composePhotoResponse(response: Unsplash.Photos): MediaPhoto {
    const photo = response.results[0];

    return {
      url: this._getPhotoUrl(photo),
      alt: photo.description,
      avgColor: photo.color,
    };
  }

  /**
   * Returns the URL of the photo.
   * @param photo - The photo object.
   * @returns The URL of the photo.
   */
  private _getPhotoUrl(photo: Unsplash.Photo): MediaPhoto['url'] {
    const { small: sm, regular: md, full: lg } = photo.urls;
    return { sm, md, lg };
  }
}
