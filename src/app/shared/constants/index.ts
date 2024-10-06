import { InjectionToken, inject } from "@angular/core";
import { environment } from "@env/environment.development";
import {
  MediaProvidersEnum,
  MediaServiceConfig,
  MediaServiceProviderCollection,
  Nutritions,
} from "@shared/types";

/**
 * The base pathname for the API endpoints related to fruit.
 */
export const API_BASE_PATHNAME = new InjectionToken<string>(
  "API_BASE_PATHNAME_TOKEN",
  {
    providedIn: "root",
    factory: () => "/api/fruit",
  },
);

/**
 * The base URL for the Fruityvice proxy.
 */
export const FRUITYVICE_PROXY_BASE_URL = new InjectionToken<string>(
  "FRUITYVICE_PROXY_BASE_URL_TOKEN",
  {
    providedIn: "root",
    factory: () => environment.fruityviceProxy,
  },
);

export const MEDIA_SERVICE_PROVIDERS =
  new InjectionToken<MediaServiceProviderCollection>(
    "MEDIA_SERVICE_PROVIDERS_TOKEN",
    {
      providedIn: "root",
      factory: () => ({
        [MediaProvidersEnum.PEXELS]: {
          name: MediaProvidersEnum.PEXELS,
          link: "https://www.pexels.com",
          description:
            "The best free stock photos & videos shared by talented creators.",
        },
        [MediaProvidersEnum.UNSPLASH]: {
          name: MediaProvidersEnum.UNSPLASH,
          link: "https://www.unsplash.com",
          description: "The internet's source of freely-usable images.",
        },
      }),
    },
  );

/**
 * Configuration object for Pexels API.
 */
export const PEXELS_API_CONFIG = new InjectionToken<MediaServiceConfig>(
  "PEXELS_API_CONFIG_TOKEN",
  {
    providedIn: "root",
    factory: () => ({
      provider: MediaProvidersEnum.PEXELS,
      baseUrl: "https://api.pexels.com",
      authConfigs: [
        {
          addTo: "headers",
          key: "Authorization",
          authorizationType: "",
          value: environment.pexelsApiKey,
        },
      ],
    }),
  },
);

/**
 * Configuration object for the Unsplash API.
 */
export const UNSPLASH_API_CONFIG = new InjectionToken<MediaServiceConfig>(
  "UNSPLASH_API_CONFIG_TOKEN",
  {
    providedIn: "root",
    factory: () => ({
      provider: MediaProvidersEnum.UNSPLASH,
      baseUrl: "https://api.unsplash.com",
      authConfigs: [
        {
          addTo: "headers",
          key: "Authorization",
          authorizationType: "Client-ID",
          value: environment.unsplashApiKey,
        },
      ],
    }),
  },
);

/**
 * Array of media service configurations.
 * @type {Array<MediaServiceConfig>}
 */
export const API_CONFIGS = new InjectionToken<Array<MediaServiceConfig>>(
  "API_CONFIGS_TOKEN",
  {
    providedIn: "root",
    factory: () => [inject(PEXELS_API_CONFIG), inject(UNSPLASH_API_CONFIG)],
  },
);

/**
 * Defines the colors associated with different nutrition types.
 */
export const NUTRITION_COLORS = new InjectionToken<
  Record<keyof Nutritions, string>
>("NUTRITION_COLORS_TOKEN", {
  providedIn: "root",
  factory: () => ({
    carbohydrates: "#fbbf24",
    protein: "#f87171",
    fat: "#60a5fa",
    calories: "#34d399",
    sugar: "#f472b6",
  }),
});

/**
 * The default color for the nutrition.
 */
export const NUTRITION_DEFAULT_COLOR = new InjectionToken<string>(
  "NUTRITION_DEFAULT_COLOR_TOKEN",
  {
    providedIn: "root",
    factory: () => "#e0e0e0",
  },
);
