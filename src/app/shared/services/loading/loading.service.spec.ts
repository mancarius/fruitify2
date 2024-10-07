import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';


describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        LoadingService,
      ]
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
      const initialLoadingCount = service['_loadingCount']();
      service.start();
      expect(service['_loadingCount']()).toEqual(initialLoadingCount + 1);
    });

  });



  describe('#stopLoading', () => {

    it('should exists', () => {
      expect(service.stop).toBeTruthy();
    });

    it('should decrease the loading count by 1', () => {
      const initialLoadingCount = 2;
      service['_loadingCount'].set(initialLoadingCount);
      service.stop();
      expect(service['_loadingCount']()).toEqual(initialLoadingCount - 1);
    });

  });



  describe('#isLoading', () => {

    it('should exists', () => {
      expect(service.loading).toBeTruthy();
    });

    it('should return true when start() is called and false when stopped', () => {
      service.start();

      expect(service.loading()).toEqual(true);

      service.stop();

      expect(service.loading()).toEqual(false);
    });

  });
});
