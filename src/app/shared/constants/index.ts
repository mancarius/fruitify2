import { environment } from "@env/environment.development";
import { MediaProvidersEnum, MediaServiceConfig, Nutritions } from "@shared/types";

export const API_BASE_PATHNAME = '/api/fruit';

/**
 * The base URL for the Fruityvice proxy.
 */
export const FRUITYVICE_PROXY_BASE_URL = environment.fruityviceProxy;

/**
 * Configuration object for Pexels API.
 */
export const PEXELS_API_CONFIG: MediaServiceConfig = {
  provider: MediaProvidersEnum.PEXELS,
  baseUrl: environment.pexelsApi,
  authConfigs: [
    {
      addTo: "headers",
      key: "Authorization",
      authorizationType: "",
      value: environment.pexelsApiKey
    }
  ]
};

/**
 * Configuration object for the Unsplash API.
 */
export const UNSPLASH_API_CONFIG: MediaServiceConfig = {
  provider: MediaProvidersEnum.UNSPLASH,
  baseUrl: environment.unsplashApi,
  authConfigs: [
    {
      addTo: "headers",
      key: "Authorization",
      authorizationType: "Client-ID",
      value: `${environment.unsplashApiKey}`
    }
  ]
};

/**
 * Array of media service configurations.
 * @type {Array<MediaServiceConfig>}
 */
export const API_CONFIGS: Array<MediaServiceConfig> = [PEXELS_API_CONFIG, UNSPLASH_API_CONFIG];


/**
 * Defines the colors associated with different nutrition types.
 */
export const NUTRITION_COLORS: Record<keyof Nutritions, string> = {
  carbohydrates: '#fbbf24',
  protein: '#f87171',
  fat: '#60a5fa',
  calories: '#34d399',
  sugar: '#f472b6',
};