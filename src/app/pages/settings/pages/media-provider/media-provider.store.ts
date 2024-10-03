import { inject, computed, signal } from "@angular/core";
import {
  MediaProvidersEnum,
  MediaServiceConfig,
  MediaServiceProvider,
  MediaServiceProviderCollection,
  Nullable,
} from "@shared/types";
import { MEDIA_SERVICE_CONFIG_TOKEN } from "@tokens";
import { API_CONFIGS, MEDIA_SERVICE_PROVIDERS } from "@shared/constants";
import {
  signalStore,
  withMethods,
  withState,
  patchState,
  withComputed,
} from "@ngrx/signals";

export type MediaProviderState = {
  providers: Nullable<MediaServiceProviderCollection>;
};

export const mediaProviderInitialState: MediaProviderState = {
  providers: null,
};

export const mediaProviderStore = signalStore(
  withState(mediaProviderInitialState),

  withComputed(
    (
      _state,
      mediaServiceConfig = inject(MEDIA_SERVICE_CONFIG_TOKEN),
      mediaServiceProviders = inject(MEDIA_SERVICE_PROVIDERS),
    ) => {
      const providers = signal<MediaServiceProviderCollection | null>(
        mediaServiceProviders,
      ).asReadonly();

      const provider = computed(() => {
        const provider = mediaServiceConfig()?.provider;
        return provider ? (providers()?.[provider] ?? null) : null;
      });

      return { provider, providers };
    },
  ),

  withMethods(
    (
      store,
      mediaServiceConfig = inject(MEDIA_SERVICE_CONFIG_TOKEN),
      apiConfigs = inject(API_CONFIGS),
    ) => ({
      setProviders: (providers: MediaServiceProviderCollection) => {
        patchState(store, { providers });
      },

      selectProvider: (providerName: MediaServiceProvider["name"]) => {
        mediaServiceConfig.set(
          getMediaConfigByProvider(apiConfigs, providerName),
        );
      },
    }),
  ),
);

/**
 * Retrieves the media service configuration based on the specified provider.
 * @param provider - The media provider.
 * @returns The media service configuration.
 */
function getMediaConfigByProvider(
  apiConfigs: MediaServiceConfig[],
  provider: MediaProvidersEnum,
): MediaServiceConfig {
  return apiConfigs.find(
    (config) => config.provider === provider,
  ) as MediaServiceConfig;
}
