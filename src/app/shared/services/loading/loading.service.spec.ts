import { TestBed, async, waitForAsync } from '@angular/core/testing';

import { LoadingService } from './loading.service';
import { skip, take } from 'rxjs';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  describe('#startLoading', () => {

    it('should exists', () => {
      expect(service.start).toBeTruthy();
    });

    it('should increase the loading count by 1', () => {
      const initialLoadingCount = service['_loadingCount'].value;
      service.start();
      expect(service['_loadingCount'].value).toEqual(initialLoadingCount + 1);
    });

  });



  describe('#stopLoading', () => {

    it('should exists', () => {
      expect(service.stop).toBeTruthy();
    });

    it('should decrease the loading count by 1', () => {
      const initialLoadingCount = service['_loadingCount'].value;
      service.stop();
      expect(service['_loadingCount'].value).toEqual(initialLoadingCount - 1);
    });

  });



  describe('#isLoading', () => {

    it('should exists', () => {
      expect(service.isLoading$).toBeTruthy();
    });

    it('should return true when the loading count is greater than 0', (done: DoneFn) => {
      service.isLoading$.pipe(skip(1), take(1)).subscribe((isLoading) => {
        expect(isLoading).toEqual(true);
        done();
      });

      service['_loadingCount'].next(1);
    });

    it('should return false when the loading count is 0', (done: DoneFn) => {
      service.isLoading$.pipe(skip(1), take(1)).subscribe((isLoading) => {
        expect(isLoading).toEqual(false);
        done();
      });
      
      service['_loadingCount'].next(0);
    });

  });
});
