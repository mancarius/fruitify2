import { environment as common } from './environment.common';

export const environment = {
  ...common, // Spread the common environment properties
  production: true,
  pexelsApiKey: "PEXELS_API_KEY",
  unsplashApiKey: "UNSPLASH_API_KEY",
};
