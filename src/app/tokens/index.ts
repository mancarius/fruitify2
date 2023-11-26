import { InjectionToken } from "@angular/core";
import { ApiAuthConfig } from "../shared/types/api-auth-config";

export const API_AUTH_CONFIG = new InjectionToken<ApiAuthConfig>('API_AUTH_CONFIG');