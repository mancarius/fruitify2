import { TestBed } from '@angular/core/testing';
import { PexelsService } from './pexels.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { PEXELS_API_CONFIG } from '@shared/constants';
import { MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { inject } from '@angular/core';
import { MediaServiceConfig } from '@shared/types';
import { Photos } from 'pexels';

fdescribe('PexelsService', () => {
  let service: PexelsService;
  let httpTesting: HttpTestingController;
  let pexelsApiConfig: MediaServiceConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PexelsService,
        provideHttpClientTesting(),
        PEXELS_API_CONFIG,
        {
          provide: MEDIA_SERVICE_CONFIG_TOKEN,
          useFactory: () => inject(PEXELS_API_CONFIG)
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PexelsService);
    httpTesting = TestBed.inject(HttpTestingController);
    pexelsApiConfig = TestBed.inject(PEXELS_API_CONFIG);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('#findPhoto', () => {
    it('should send a GET request to the correct URL and return the found photo', async () => {
      const query = 'nature';
      const options = { limit: 5 };
      const mockResponse: Photos = {
        page: 1,
        per_page: 1,
        next_page: 2,
        photos: [
          {
            id: 123,
            width: 1920,
            height: 1080,
            url: 'https://example.com/photo.jpg',
            photographer: 'John Doe',
            photographer_url: 'https://example.com/johndoe',
            photographer_id: '123',
            avg_color: '#abcdef',
            alt: 'Nature',
            liked: false,
            src: {
              original: 'https://example.com/photo.jpg',
              large2x: 'https://example.com/photo.jpg',
              large: 'https://example.com/photo.jpg',
              medium: 'https://example.com/photo.jpg',
              small: 'https://example.com/photo.jpg',
              portrait: 'https://example.com/photo.jpg',
              landscape: 'https://example.com/photo.jpg',
              tiny: 'https://example.com/photo.jpg',
            },
          },
        ],
      };

      const photo$ = service.findPhoto(query, options);

      const photoPromise = firstValueFrom(photo$);

      const req = httpTesting.expectOne((request) => {
        const expectedHeaders = pexelsApiConfig.authConfigs.filter(config => config.addTo === 'headers');
        const expectedParams = pexelsApiConfig.authConfigs.filter(config => config.addTo === 'params');

        return (
          request.method === 'GET' &&
          request.url === 'https://api.pexels.com/v1/search' &&
          request.params.get('query') == query &&
          request.params.get('per_page') == options.limit.toString() &&
          // check authentication headers and params if they exist
          (!expectedHeaders.length || expectedHeaders.every(header => request.headers.get(header.key) == header.value)) &&
          (!expectedParams.length || expectedParams.every(param => request.params.get(param.key) == param.value))
        );
      });

      req.flush(mockResponse);

      const photo = await photoPromise;

      expect(photo.url).toBe({ sm: 'https://example.com/photo.jpg' });
      expect(photo.alt).toBe('Nature');
      expect(photo.avgColor).toBe('#abcdef');
    });
  });
});
