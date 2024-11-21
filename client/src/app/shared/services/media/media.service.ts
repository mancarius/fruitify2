import { Inject, Injectable, Signal, effect, untracked } from '@angular/core';
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
  private readonly _providerMap = new Map<MediaProvidersEnum, AbstractMediaProviderService>();
  /**
   * The media provider used by the media service.
   */
  private _provider: AbstractMediaProviderService | null = null;



  constructor(
    @Inject(MEDIA_SERVICE_CONFIG_TOKEN) readonly mediaServiceConfig: Signal<MediaServiceConfig | null>,
    private readonly _http: HttpClient
  ) {
    this._assignProvider(mediaServiceConfig());

    effect(() => {
      if (this._provider?.providerName !== mediaServiceConfig()?.provider) {
        untracked(() => this._assignProvider(mediaServiceConfig()))
      }
    });
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
    if (!config) {
      this._provider = null;
      throw new Error('Media provider configuration not found.');
    }

    this._provider = this._getProvider(config);
  }

  /**
   * Retrieves the media provider based on the provided configuration.
   * If the configuration is null, returns null.
   * If the provider does not exist, creates a new one and returns it.
   *
   * @param config - The configuration object for the media service.
   * @returns The media provider service instance or null if the configuration is null.
   */
  private _getProvider(config: MediaServiceConfig | null): AbstractMediaProviderService | null {
    if (!config) {
      return null;
    }

    this._createProviderIfNotExists(config);

    return this._providerMap.get(config.provider) ?? null;
  }

  private _createProviderIfNotExists(config: MediaServiceConfig): void {
    if (!this._providerMap.has(config.provider)) {
      switch (config.provider) {
        case MediaProvidersEnum.PEXELS:
          this._providerMap.set(config.provider, new PexelsService(config, this._http));
          break;
        case MediaProvidersEnum.UNSPLASH:
          this._providerMap.set(config.provider, new UnsplashService(config, this._http));
          break;
        default:
          throw new Error(`Media provider '${config.provider}' not supported.`);
      }
    }
  }
}
