import {
  ApplicationConfig,
  isDevMode,
  provideExperimentalZonelessChangeDetection,
  signal,
  inject,
  ENVIRONMENT_INITIALIZER,
} from "@angular/core";
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
  withViewTransitions,
} from "@angular/router";
import routes from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { provideServiceWorker } from "@angular/service-worker";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { MediaServiceConfig } from "@shared/types";
import { MEDIA_SERVICE_CONFIG_TOKEN } from "@tokens";
import { authenticationInterceptor } from "@core/interceptors";
import { PEXELS_API_CONFIG } from "@shared/constants";
import { registerCustomSvgIcons } from "@core/utils/registerCustomSvgIcons";

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withRouterConfig({ paramsInheritanceStrategy: "always" }),
    ),

    provideAnimations(),

    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),

    provideHttpClient(withInterceptors([authenticationInterceptor])),

    {
      provide: MEDIA_SERVICE_CONFIG_TOKEN,
      useFactory: () =>
        signal<MediaServiceConfig | null>(inject(PEXELS_API_CONFIG)),
    },

    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" },
    },

    {
      provide: ENVIRONMENT_INITIALIZER,
      useFactory() {
        return registerCustomSvgIcons;
      },
      multi: true,
    }
  ],
};
