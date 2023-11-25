import { Injectable } from '@angular/core';
import { MediaOptions, MediaPhoto, MediaVideo } from '../../types';
import { Observable, map } from 'rxjs';
import { MediaService } from '../media/media.service';
import { HttpClient } from '@angular/common/http';
import { PaginationParams, Photos, Videos, Photo } from 'pexels';
import { PEXELS_API_BASE_URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class PexelsService extends MediaService {
  private _defaultOptions: MediaOptions & PaginationParams = {
    ...this.defaultQueryOptions,
    page: 1,
    per_page: 1,
  };

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Finds a photo based on the provided query and options.
   * @param query - The search query for the photo.
   * @param options - Additional options for the search query (optional).
   * @returns An Observable that emits the found photo.
   */
  findPhoto(query: string, options: Partial<MediaOptions> = {}): Observable<MediaPhoto> {
    const queryOptions = { ...this._defaultOptions, ...options };
    const url = this._getPhotosUrl();
    const params = this._composeQueryParams(query, queryOptions);

    return this.http.get<Photos>(url, { params }).pipe(
      map(response => this._composePhotoResponse(response))
    );
  }

  /**
   * Finds a video based on the specified query and options.
   * @param query The search query for the video.
   * @param options The optional parameters for the search query.
   * @returns An Observable that emits the video response.
   */
  findVideo(query: string, options: Partial<MediaOptions> = {}): Observable<MediaVideo> {
    const queryOptions = { ...this._defaultOptions, ...options };
    const url = this._getVideosUrl();
    const params = this._composeQueryParams(query, queryOptions);

    return this.http.get<Videos>(url, { params }).pipe(
      map(response => this._composeVideoResponse(response))
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
   * Returns the URL for retrieving videos from the Pexels API.
   * @returns The URL string.
   */
  private _getVideosUrl(): string {
    const url = this._composeUrl('videos/search');

    return url.toString();
  }


  /**
   * Composes a URL with the given pathname.
   * @param pathname - The pathname to be appended to the base URL.
   * @returns The composed URL.
   */
  private _composeUrl(pathname: string): URL {
    const url = new URL(PEXELS_API_BASE_URL);
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
   * Composes a video response object from the API response.
   * @param response - The API response containing video data.
   * @returns The composed video response object.
   */
  private _composeVideoResponse(response: Videos): MediaVideo {
    const video = response.videos[0];

    return {
      url: video.video_files[0].link,
      picture: video.image,
      fileType: video.video_files[0].file_type,
    };
  }

  /**
   * Returns the URL of the photo.
   * @param photo - The photo object.
   * @returns The URL of the photo.
   */
  private _getPhotoUrl(photo: Photo): string {
    return Object.values(photo.src)[0];
  }
}
