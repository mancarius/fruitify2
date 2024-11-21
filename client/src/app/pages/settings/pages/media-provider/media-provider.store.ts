import { inject, computed } from "@angular/core";
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
  withHooks,
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
      state,
      mediaServiceConfig = inject(MEDIA_SERVICE_CONFIG_TOKEN),
    ) => {
      const provider = computed(() => {
        const provider = mediaServiceConfig()?.provider;
        return provider ? (state.providers()?.[provider] ?? null) : null;
      });

      const emptyProviders = computed(() => Object.keys(state.providers() ?? {})?.length === 0);

      return { provider, emptyProviders };
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

  withHooks({
    onInit: (
      { setProviders },
      mediaServiceProviders = inject(MEDIA_SERVICE_PROVIDERS)
    ) => {
      setProviders(mediaServiceProviders);
    },
  }),
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
