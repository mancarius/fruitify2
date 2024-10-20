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
