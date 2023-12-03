import { Inject, Injectable } from '@angular/core';
import { PhotoFinder, MediaOrientation, MediaPhoto, MediaOptions, MediaSize, MediaServiceConfig } from '../../types';
import { Observable } from 'rxjs';
import { MEDIA_SERVICE_CONFIG } from '@tokens/api';

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


  constructor(@Inject(MEDIA_SERVICE_CONFIG) protected readonly _providerConfig: MediaServiceConfig) {}


  abstract findPhoto(query: string, options?: Partial<MediaOptions>): Observable<MediaPhoto>;
}