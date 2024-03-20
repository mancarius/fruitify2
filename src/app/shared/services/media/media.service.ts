import { Inject, Injectable, Signal, effect } from '@angular/core';
import { PhotoFinder, MediaPhoto, MediaOptions, MediaServiceConfig, MediaProvidersEnum } from '../../types';
import { Observable } from 'rxjs';
import { MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';
import { AbstractMediaProviderService } from '../abstract-media-provider/abstract-media-provider.service';
import { HttpClient } from '@angular/common/http';
import { PexelsService } from '../pexels/pexels.service';
import { UnsplashService } from '../unsplash/unsplash.service';

/**
 * Service for finding media, such as photos, using a media provider.
 */
@Injectable({
  providedIn: 'root'
})
export class MediaService implements PhotoFinder {
  /**
   * The media provider used by the media service.
   */
  private _provider!: AbstractMediaProviderService;
  

  constructor(
    @Inject(MEDIA_SERVICE_CONFIG_TOKEN) readonly mediaServiceConfig: Signal<MediaServiceConfig | null>,
    private readonly _http: HttpClient
  ) {
    effect(() => this._assignProvider(mediaServiceConfig()));
  }


  findPhoto(query: string, options?: Partial<MediaOptions>): Observable<MediaPhoto> {
    if (!this._provider) throw new Error('Media provider not assigned.');
    
    return this._provider.findPhoto(`${query} fruit`, options);
  }


  /**
   * Assigns a media provider based on the given configuration.
   * @param config The configuration object for the media service.
   * @throws Error if the specified media provider is not supported.
   */
  private _assignProvider(config: MediaServiceConfig | null): void {
    switch (config?.provider) {
      case MediaProvidersEnum.PEXELS:
        this._provider = new PexelsService(config, this._http);
        break;
      case MediaProvidersEnum.UNSPLASH:
        this._provider = new UnsplashService(config, this._http);
        break;
      default:
        throw new Error(`Media provider '${config?.provider}' not supported.`);
    }
  }
}