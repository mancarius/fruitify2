import { TestBed } from '@angular/core/testing';
import { PexelsService } from './pexels.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { config, firstValueFrom } from 'rxjs';
import { PEXELS_API_CONFIG } from '@shared/constants';
import { MEDIA_SERVICE_CONFIG } from '@tokens/api';

describe('PexelsService', () => {
  let service: PexelsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PexelsService,
        provideHttpClientTesting(),
        {
          provide: MEDIA_SERVICE_CONFIG,
          useValue: PEXELS_API_CONFIG
        }
      ]
    });
    service = TestBed.inject(PexelsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('#findPhoto', () => {
    it('should send a GET request to the correct URL and return the found photo', async () => {
      const query = 'nature';
      const options = { limit: 5 };
      const mockResponse = {
        photos: [
          {
            src: {
              original: 'https://example.com/photo.jpg',
            },
            alt: 'Nature',
            avg_color: '#abcdef',
          },
        ],
      };

      const photo$ = service.findPhoto(query, options);

      const photoPromise = firstValueFrom(photo$);

      const req = httpTesting.expectOne((request) => {
        const expectedHeaders = PEXELS_API_CONFIG.authConfigs.filter(config => config.addTo === 'headers');
        const expectedParams = PEXELS_API_CONFIG.authConfigs.filter(config => config.addTo === 'params');

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

      expect(photo.url).toBe('https://example.com/photo.jpg');
      expect(photo.alt).toBe('Nature');
      expect(photo.avgColor).toBe('#abcdef');
    });
  });
});
