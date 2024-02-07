import { ComponentStore, OnStateInit } from "@ngrx/component-store";
import { Inject, Injectable, Injector, WritableSignal, effect } from "@angular/core";
import { MediaProvidersEnum, MediaServiceConfig, MediaServiceProvider, MediaServiceProviderCollection, Nullable } from "@shared/types";
import { MEDIA_SERVICE_CONFIG_TOKEN } from "@tokens";
import { Observable, tap } from "rxjs";
import { API_CONFIGS, MEDIA_SERVICE_PROVIDERS } from "@shared/constants";

export type MediaProviderState = {
  providers: MediaServiceProviderCollection;
  provider: Nullable<MediaServiceProvider>;
}

export const mediaProviderInitialState: MediaProviderState = {
  providers: MEDIA_SERVICE_PROVIDERS,
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
        this.patchState({ provider: this.get().providers[provider] });
      }
    }, { injector: this._injector, allowSignalWrites: true });
  }


  /* ===== Selectors ===== */

  readonly provider$ = this.select(state => state.provider);
  readonly vm$ = this.select(({ providers }) => ({ providers }));


  /* ===== Effects ===== */

  /**
   * Selects a media provider and updates the media service configuration accordingly.
   * @param provider$ An observable that emits the selected media provider.
   */
  readonly selectProvider = this.effect((providerName$: Observable<MediaServiceProvider['name']>) => {
    return providerName$.pipe(
      tap(providerName => this._mediaServiceConfig.set(this._getMediaConfigByProvider(providerName))),
    );
  });


  /* ===== Private methods ===== */

  /**
   * Retrieves the media service configuration based on the specified provider.
   * @param provider - The media provider.
   * @returns The media service configuration.
   */
  private _getMediaConfigByProvider(provider: MediaProvidersEnum): MediaServiceConfig {
    return API_CONFIGS.find(config => config.provider === provider) as MediaServiceConfig;
  }
}