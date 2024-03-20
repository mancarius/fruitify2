import { TestBed } from '@angular/core/testing';
import { AbstractMediaProviderService } from './abstract-media-provider.service';

describe('AbstractMediaProviderService', () => {
  let service: AbstractMediaProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbstractMediaProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});