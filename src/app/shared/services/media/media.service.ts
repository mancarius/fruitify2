import { Injectable } from '@angular/core';
import { IMediaFinder, MediaOrientation, MediaPhoto, MediaOptions, MediaSize, MediaVideo } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class MediaService implements IMediaFinder {
  readonly defaultQueryOptions: MediaOptions = {
    page: 1,
    limit: 10,
    size: MediaSize.MEDIUM,
    orientation: MediaOrientation.LANDSCAPE,
  };

  abstract findPhoto(query: string, options?: Partial<MediaOptions>): Observable<MediaPhoto>;

  abstract findVideo(query: string, options?: Partial<MediaOptions>): Observable<MediaVideo>;
}