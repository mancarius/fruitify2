import { HttpContextToken } from "@angular/common/http";
import { InjectionToken, WritableSignal, inject } from "@angular/core";
import { environment } from "@env/environment.dev";
import {
  MediaOptions,
  MediaOrientation,
  MediaProvidersEnum,
  MediaServiceConfig,
  MediaServiceProviderCollection,
  Nullable,
  Nutritions,
} from "@shared/types";

/**
 * The base pathname for the API endpoints related to fruit.
 */
export const API_BASE_PATHNAME = new InjectionToken<string>(
  "API_BASE_PATHNAME_TOKEN",
  {
    providedIn: "root",
    factory: () => "/api",
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

/**
 * Injection token for the media service configuration.
 * It is used to provide a BehaviorSubject of type MediaServiceConfig.
 */
export const MEDIA_SERVICE_CONFIG_TOKEN = new InjectionToken<
  WritableSignal<Nullable<MediaServiceConfig>>
>("MEDIA_SERVICE_CONFIG_TOKEN", {
  providedIn: "root",
  factory: () => {
    throw new Error("MEDIA_SERVICE_CONFIG_TOKEN is not provided");
  },
});

/**
 * Context token for the authentication configuration.
 * It is used to provide a function that returns an array of authentication configurations.
 */
export const AUTH_CONFIG_CONTEXT_TOKEN = new HttpContextToken<
  MediaServiceConfig["authConfigs"]
>(() => []);

/**
 * Injection token for the maximum number of suggestions to show in the preview.
 */
export const MAX_SUGGESTIONS_PREVIEW_OPTION = new InjectionToken<number>(
  "MAX_SUGGESTIONS_PREVIEW_OPTION",
  {
    providedIn: "root",
    factory: () => {
      throw new Error("MAX_SUGGESTIONS_PREVIEW_OPTION is not provided");
    },
  }
);

/**
 * Injection token for the default options for the photo search.
 */
export const PHOTO_DEFAULT_OPTIONS = new InjectionToken<Partial<MediaOptions>>(
  "PHOTO_DEFAULT_OPTIONS",
  {
    providedIn: "root",
    factory: () => ({
      limit: 1,
      orientation: MediaOrientation.LANDSCAPE,
    }),
  },
);

/**
 * Injection token for the text of the show more button.
 */
export const SHOW_MORE_BUTTON_TEXT = new InjectionToken<{
  openText: string;
  closeText: string;
}>("SHOW_MORE_BUTTON_TEXT", {
  providedIn: "root",
  factory: () => ({
    openText: "Show more",
    closeText: "Show less",
  })
});
