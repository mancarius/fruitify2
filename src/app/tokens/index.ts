import { HttpContextToken } from "@angular/common/http";
import { InjectionToken, WritableSignal } from "@angular/core";
import {
  MediaServiceConfig,
  Nullable,
  MediaOptions,
  MediaOrientation,
} from "@shared/types";

/**
 * Injection token for the media service configuration.
 * It is used to provide a BehaviorSubject of type MediaServiceConfig.
 */
export const MEDIA_SERVICE_CONFIG_TOKEN = new InjectionToken<
  WritableSignal<Nullable<MediaServiceConfig>>
>("MEDIA_SERVICE_CONFIG");

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
