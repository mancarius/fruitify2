import { TestBed } from '@angular/core/testing';
import { UnsplashService } from './unsplash.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { AUTH_CONFIG_CONTEXT_TOKEN, MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';
import { UNSPLASH_API_CONFIG } from '@shared/constants';
import { inject, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MediaServiceConfig, Unsplash } from '@shared/types';

fdescribe('UnsplashService', () => {
  let service: UnsplashService;
  let httpTesting: HttpTestingController;
  let unsplashApiConfig: MediaServiceConfig;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        UnsplashService,
        provideExperimentalZonelessChangeDetection(),
        provideHttpClientTesting(),
        {
          provide: MEDIA_SERVICE_CONFIG_TOKEN,
          useFactory: () => inject(UNSPLASH_API_CONFIG)
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UnsplashService);
    unsplashApiConfig = TestBed.inject(UNSPLASH_API_CONFIG);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('#findPhoto', () => {
    it('should send a GET request to the correct URL and return the found photo', async () => {
      const query = 'nature';
      const options = { limit: 5 };
      const mockResponse: Unsplash.Photos = {
        total: 1,
        total_pages: 1,
        results: [
          {
            id: '123',
            description: 'Nature',
            urls: {
              raw: 'https://example.com/photo.jpg',
              full: 'https://example.com/photo.jpg',
              regular: 'https://example.com/photo.jpg',
              small: 'https://example.com/photo.jpg',
              thumb: 'https://example.com/photo.jpg',
            },
            color: '#abcdef',
          },
        ],
      };

      const photo$ = service.findPhoto(query, options);

      const photoPromise = firstValueFrom(photo$);

      const req = httpTesting.expectOne((request) => {
        const expectedContext = unsplashApiConfig.authConfigs.filter(config => config.addTo === 'headers');
        const expectedParams = unsplashApiConfig.authConfigs.filter(config => config.addTo === 'params');
        const expectedUrl = unsplashApiConfig.baseUrl + '/search/photos';
        const requestContext = request.context.get(AUTH_CONFIG_CONTEXT_TOKEN);

        return (
          request.method === 'GET' &&
          request.url === expectedUrl &&
          request.params.get('query') == query &&
          request.params.get('per_page') == options.limit.toString() &&
          // check authentication headers and params if they exist
          (!expectedContext.length || expectedContext.every(ctx => requestContext.some(rCtx => rCtx.key == ctx.key && rCtx.value == ctx.value))) &&
          (!expectedParams.length || expectedParams.every(param => request.params.get(param.key) == param.value))
        );
      });

      req.flush(mockResponse);

      const photo = await photoPromise;

      expect(photo.url).toEqual({
        sm: 'https://example.com/photo.jpg',
        md: 'https://example.com/photo.jpg',
        lg: 'https://example.com/photo.jpg',
      });
      expect(photo.alt).toBe('Nature');
      expect(photo.avgColor).toBe('#abcdef');
    });
  });
});
