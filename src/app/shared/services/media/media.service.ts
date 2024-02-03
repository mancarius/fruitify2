import { Inject, Injectable, Signal, effect } from '@angular/core';
import { PhotoFinder, MediaPhoto, MediaOptions, MediaServiceConfig, MediaProvidersEnum } from '../../types';
import { Observable } from 'rxjs';
import { MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';
import { AbstractMediaProviderService } from '../abstract-media-provider/abstract-media-provider.service';
import { HttpClient } from '@angular/common/http';
import { PexelsService } from '../pexels/pexels.service';
import { UnsplashService } from '../unsplash/unsplash.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service for finding media, such as photos, using a media provider.
 */
export class MediaService implements PhotoFinder {
  
  private provider!: AbstractMediaProviderService;
  
  constructor(
    @Inject(MEDIA_SERVICE_CONFIG_TOKEN) readonly mediaServiceConfig: Signal<MediaServiceConfig | null>,
    readonly http: HttpClient
  ) {
    effect(() => {
      const config = mediaServiceConfig();

      switch (config?.provider) {
        case MediaProvidersEnum.PEXELS:
          this.provider = new PexelsService(config, http);
          break;
        case MediaProvidersEnum.UNSPLASH:
          this.provider = new UnsplashService(config, http);
          break;
        default:
          throw new Error(`Media provider '${config?.provider}' not supported.`);
      }
    });
  }

  findPhoto(query: string, options?: Partial<MediaOptions>): Observable<MediaPhoto> {
    return this.provider.findPhoto(query + " fruit", options);
  }
}