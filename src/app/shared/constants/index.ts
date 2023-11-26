import { environment } from "@env/environment.development";
import { ApiAuthConfig } from "@shared/types/api-auth-config";

export const API_BASE_PATHNAME = '/api/fruit';

export const FRUITYVICE_PROXY_BASE_URL = environment.fruityviceProxy;

export const PEXELS_API_BASE_URL = environment.pexelsApi;

export const PEXELS_API_AUTH_CONFIG: ApiAuthConfig = {
  addTo: "headers",
  key: "Authorization",
  authorizationType: "",
  value: environment.pexelsApiKey
};

export const PEXELS_API_AUTH_KEY = "Authorization";

export const UNSPLASH_API_BASE_URL = environment.unsplashApi;

export const UNSPLASH_API_AUTH_CONFIG: ApiAuthConfig = {
  addTo: "headers",
  key: "Authorization",
  authorizationType: "Client-ID",
  value: `${environment.unsplashApiKey}`
};