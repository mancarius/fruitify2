import { TestBed } from '@angular/core/testing';
import { MediaService } from './media.service';
import { MEDIA_SERVICE_CONFIG } from '@tokens/api';
import { PEXELS_API_CONFIG } from '@shared/constants';


describe('MediaService', () => {
  let service: MediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MEDIA_SERVICE_CONFIG,
          useValue: PEXELS_API_CONFIG
        }
      ]
    });
    service = TestBed.inject(MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
