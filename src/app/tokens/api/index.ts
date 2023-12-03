import { InjectionToken } from "@angular/core";
import { MediaServiceConfig } from "@shared/types";
import { BehaviorSubject } from "rxjs";

export const MEDIA_SERVICE_CONFIG = new InjectionToken<BehaviorSubject<MediaServiceConfig>>('MEDIA_SERVICE_CONFIG');