import { ComponentStore, OnStateInit } from "@ngrx/component-store";
import { Inject, Injectable, Injector, WritableSignal, effect } from "@angular/core";
import { MediaProvidersEnum, MediaServiceConfig, Nullable } from "@shared/types";
import { MEDIA_SERVICE_CONFIG_TOKEN } from "@tokens";
import { Observable, tap } from "rxjs";
import { PEXELS_API_CONFIG, UNSPLASH_API_CONFIG } from "@shared/constants";

export type MediaProviderState = {
  providers: MediaProvidersEnum[];
  provider: Nullable<MediaProvidersEnum>;
}

export const mediaProviderInitialState: MediaProviderState = {
  providers: Object.values(MediaProvidersEnum) || [],
  provider: null,
};

@Injectable()
export class MediaProviderStore extends ComponentStore<MediaProviderState> implements OnStateInit {
  constructor(
    @Inject(MEDIA_SERVICE_CONFIG_TOKEN) private _mediaServiceConfig: WritableSignal<Nullable<MediaServiceConfig>>,
    private _injector: Injector,
  ) {
    super(mediaProviderInitialState);
  }

  ngrxOnStateInit(): void {
    effect(() => {
      const provider = this._mediaServiceConfig()?.provider;
      if (provider) {
        this.patchState({ provider });
      }
    }, { injector: this._injector, allowSignalWrites: true });
  }

  readonly provider$ = this.select(state => state.provider);

  readonly vm$ = this.select(({ providers }) => ({ providers }));

  readonly selectProvider = this.effect((provider$: Observable<MediaProvidersEnum>) => {
    return provider$.pipe(
      tap(provider => this._mediaServiceConfig.set(this._getMediaConfigByProvider(provider))),
    );
  });

  /**
   * Retrieves the media service configuration based on the specified provider.
   * @param provider - The media provider.
   * @returns The media service configuration.
   * @throws Error if the provider is invalid.
   */
  private _getMediaConfigByProvider(provider: MediaProvidersEnum): MediaServiceConfig {
    switch (provider) {
      case MediaProvidersEnum.PEXELS:
        return PEXELS_API_CONFIG;
      case MediaProvidersEnum.UNSPLASH:
        return UNSPLASH_API_CONFIG;
      default:
        throw new Error('Invalid media provider');
    }
  }
}