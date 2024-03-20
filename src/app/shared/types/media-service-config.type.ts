import { MediaProvidersEnum } from './media-providers.enum';


/**
 * Represents the configuration for API authentication.
 */
export type ApiAuthConfig = {
  addTo: "headers";
  key: string,
  authorizationType: string;
  value: string;
} | {
  addTo: "params";
  key: string;
  value: string;
};

/**
 * Configuration for media service.
 */
export type MediaServiceConfig = {
  provider: MediaProvidersEnum;
  authConfigs: Array<ApiAuthConfig>;
  baseUrl: string;
};