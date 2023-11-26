import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { fruityviceProxyInterceptor } from '@core/interceptors/fruityvice-proxy/fruityvice-proxy.interceptor';
import { BehaviorSubject } from 'rxjs';
import { ApiAuthConfig } from '@shared/types/api-auth-config';
import { API_AUTH_CONFIG } from '@tokens';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),

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
            withInterceptors([fruityviceProxyInterceptor])
        ),

        {
            provide: API_AUTH_CONFIG,
            useFactory: () => new BehaviorSubject<ApiAuthConfig|null>(null)
        },

        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' }
        },
    ]
};
