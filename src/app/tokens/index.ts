import { HttpContextToken } from "@angular/common/http";
import { InjectionToken } from "@angular/core";
import { MediaServiceConfig } from "@shared/types";
import { BehaviorSubject } from "rxjs";

/**
 * Injection token for the media service configuration.
 * It is used to provide a BehaviorSubject of type MediaServiceConfig.
 */
export const MEDIA_SERVICE_CONFIG_TOKEN = new InjectionToken<BehaviorSubject<MediaServiceConfig|null>>('MEDIA_SERVICE_CONFIG');

/**
 * Context token for the authentication configuration.
 * It is used to provide a function that returns an array of authentication configurations.
 */
export const AUTH_CONFIG_CONTEXT_TOKEN = new HttpContextToken<MediaServiceConfig['authConfigs']>(() => []);