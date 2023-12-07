import { Observable } from 'rxjs';
import { MediaOptions, MediaPhoto, MediaSize, MediaOrientation, MediaServiceConfig, PhotoFinder } from '@shared/types';
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
    size: MediaSize.MEDIUM,
    orientation: MediaOrientation.LANDSCAPE,
  };

  constructor(protected readonly _providerConfig: MediaServiceConfig) { }

  abstract findPhoto(query: string, options?: Partial<MediaOptions>): Observable<MediaPhoto>;
}