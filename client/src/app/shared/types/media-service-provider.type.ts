import { MediaProvidersEnum } from './media-providers.enum';

/**
 * Represents a media service provider.
 */
export type MediaServiceProvider = {
  name: MediaProvidersEnum;
  link: string;
  description: string;
};

/**
 * Represents a collection of media service providers.
 */
export type MediaServiceProviderCollection = {
  [key in MediaProvidersEnum]: MediaServiceProvider;
};