import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideServiceWorker } from '@angular/service-worker';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { MediaServiceConfig } from '@shared/types';
import { MEDIA_SERVICE_CONFIG } from '@tokens/api';
import { authenticationInterceptor, fruityviceProxyInterceptor } from '@core/interceptors';
import { MediaService } from '@shared/services/media/media.service';
import { mediaServiceFactory } from '@shared/helpers';

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
            withInterceptors([
                fruityviceProxyInterceptor,
                authenticationInterceptor
            ])
        ),

        {
            provide: MEDIA_SERVICE_CONFIG,
            useFactory: () => new BehaviorSubject<MediaServiceConfig|null>(null)
        },

        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' }
        },

        {
            provide: MediaService,
            useFactory: mediaServiceFactory,
            deps: [MEDIA_SERVICE_CONFIG, HttpClient]
        },
    ]
};
