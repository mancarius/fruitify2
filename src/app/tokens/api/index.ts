import { HttpContextToken } from "@angular/common/http";
import { InjectionToken } from "@angular/core";
import { MediaServiceConfig } from "@shared/types";
import { BehaviorSubject } from "rxjs";

/**
 * Injection token for the media service configuration.
 * It is used to provide a BehaviorSubject of type MediaServiceConfig.
 */
export const MEDIA_SERVICE_CONFIG = new InjectionToken<BehaviorSubject<MediaServiceConfig>>('MEDIA_SERVICE_CONFIG');

/**
 * Token for the media service authentication.
 * This context token is used to provide the configuration for the media service authentication to interceptors.
 */
export const MEDIA_SERVICE_AUTH = new HttpContextToken<MediaServiceConfig['authConfigs']>(() => []);