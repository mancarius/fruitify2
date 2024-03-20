import { TestBed } from '@angular/core/testing';
import { MediaService } from './media.service';
import { MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MEDIA_SERVICE_CONFIG_TOKEN],
    });
    service = TestBed.inject(MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
