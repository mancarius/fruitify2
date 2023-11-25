import { TestBed } from '@angular/core/testing';
import { PexelsService } from './pexels.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

describe('PexelsService', () => {
  let service: PexelsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PexelsService,
        provideHttpClientTesting(),
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
        return (
          request.method === 'GET' &&
          request.url === 'https://api.pexels.com/v1/search' &&
          request.params.get('query') == query &&
          request.params.get('per_page') == options.limit.toString()
        );
      });
      
      req.flush(mockResponse);

      const photo = await photoPromise;

      expect(photo.url).toBe('https://example.com/photo.jpg');
      expect(photo.alt).toBe('Nature');
      expect(photo.avgColor).toBe('#abcdef');
    });
  });



  describe('#findVideo', () => {
    it('should send a GET request to the correct URL and return the found video', async () => {
      const query = 'ocean';
      const options = { limit: 3 };
      const mockResponse = {
        videos: [
          {
            video_files: [
              {
                link: 'https://example.com/video.mp4',
                file_type: 'video/mp4',
              },
            ],
            image: 'https://example.com/video.jpg',
          },
        ],
      };

      const video$ = service.findVideo(query, options);

      const videoPromise = firstValueFrom(video$);

      const req = httpTesting.expectOne((request) => {
        return (
          request.method === 'GET' &&
          request.url === 'https://api.pexels.com/videos/search' &&
          request.params.get('query') === query &&
          request.params.get('per_page') === options.limit.toString()
        );
      });

      req.flush(mockResponse);

      const video = await videoPromise;

      expect(video.url).toBe('https://example.com/video.mp4');
      expect(video.picture).toBe('https://example.com/video.jpg');
      expect(video.fileType).toBe('video/mp4');
    });
  });
});
