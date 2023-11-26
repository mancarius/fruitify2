import { InjectionToken } from "@angular/core";
import { ApiAuthConfig } from "@shared/types/api-auth-config";
import { BehaviorSubject } from "rxjs";

export const API_AUTH_CONFIG = new InjectionToken<BehaviorSubject<ApiAuthConfig>>('API_AUTH_CONFIG');