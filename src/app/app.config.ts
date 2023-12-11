import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideServiceWorker } from '@angular/service-worker';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { MediaServiceConfig } from '@shared/types';
import { MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';
import { authenticationInterceptor } from '@core/interceptors';
import { MediaService } from '@shared/services/media/media.service';
import { mediaServiceFactory } from '@shared/helpers';
import { PEXELS_API_CONFIG } from '@shared/constants';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withComponentInputBinding()),

        provideAnimations(),

        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),

        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),

        provideHttpClient(
            withInterceptors([authenticationInterceptor])
        ),

        {
            provide: MEDIA_SERVICE_CONFIG_TOKEN,
            useFactory: () => new BehaviorSubject<MediaServiceConfig | null>(PEXELS_API_CONFIG)
        },

        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' }
        },

        {
            provide: MediaService,
            useFactory: mediaServiceFactory,
            deps: [MEDIA_SERVICE_CONFIG_TOKEN, HttpClient]
        },
    ]
};
