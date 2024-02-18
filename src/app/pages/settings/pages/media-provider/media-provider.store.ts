import { ComponentStore, OnStateInit } from "@ngrx/component-store";
import { Inject, Injectable, Injector, WritableSignal, effect, inject } from "@angular/core";
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
  readonly #injector = inject(Injector);
  readonly #mediaServiceConfig: WritableSignal<Nullable<MediaServiceConfig>> = inject(MEDIA_SERVICE_CONFIG_TOKEN);

  constructor() { super(mediaProviderInitialState) }

  ngrxOnStateInit(): void {
    effect(() => {
      const provider = this.#mediaServiceConfig()?.provider;
      if (provider) {
        this.patchState({ provider: this.get().providers[provider] });
      }
    }, { injector: this.#injector, allowSignalWrites: true });
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
      tap(providerName => this.#mediaServiceConfig.set(this.#getMediaConfigByProvider(providerName))),
    );
  });


  /* ===== Private methods ===== */

  /**
   * Retrieves the media service configuration based on the specified provider.
   * @param provider - The media provider.
   * @returns The media service configuration.
   */
  #getMediaConfigByProvider(provider: MediaProvidersEnum): MediaServiceConfig {
    return API_CONFIGS.find(config => config.provider === provider) as MediaServiceConfig;
  }
}