import { Injectable } from '@angular/core';
import { PhotoFinder, MediaPhoto, MediaOptions } from '../../types';
import { AbstractMediaProviderService } from '../abstract-provider/abstract-media-provider.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for finding media, such as photos, using a media provider.
 */
export class MediaService implements PhotoFinder {
  constructor(private readonly provider: AbstractMediaProviderService) {}

  findPhoto(query: string, options?: Partial<MediaOptions>): Observable<MediaPhoto> {
    return this.provider.findPhoto(query, options);
  }
}