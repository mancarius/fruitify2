import { TestBed } from '@angular/core/testing';
import { MediaService } from './media.service';
import { MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';
import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { MediaPhoto, MediaProvidersEnum, MediaServiceConfig } from '../../types';
import { PexelsService } from '../pexels/pexels.service';
import { UnsplashService } from '../unsplash/unsplash.service';


fdescribe('MediaService', () => {
  let service: MediaService;
  let pexelsService: PexelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: MEDIA_SERVICE_CONFIG_TOKEN,
          useValue: signal<MediaServiceConfig>({
            provider: MediaProvidersEnum.PEXELS,
            authConfigs: [],
            baseUrl: 'https://api.pexels.com/v1',
          }),
        }],
    });
    service = TestBed.inject(MediaService);
    pexelsService = TestBed.inject(PexelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should assign the correct provider based on the configuration', () => {
    expect(service['_provider']).toBeInstanceOf(PexelsService);
  });

  it('should throw an error if media provider is not assigned', () => {
    service['_provider'] = null;
    expect(() => service.findPhoto('test')).toThrowError('Media provider not assigned.');
  });

  it('should call findPhoto on the assigned provider', async () => {
    const findPhotoSpy = spyOn<any>(service['_provider'], 'findPhoto').and.returnValue(of({} as MediaPhoto));
    await firstValueFrom(service.findPhoto('test'));
    expect(findPhotoSpy).toHaveBeenCalledWith('test fruit', undefined);
  });

  it('should throw an error if media provider configuration is not found', () => {
    expect(() => service['_assignProvider'](null)).toThrowError('Media provider configuration not found.');
  });

  it('should create a new provider if it does not exist in the provider map', () => {
    service['_providerMap'].clear();
    service['_assignProvider']({ provider: MediaProvidersEnum.UNSPLASH } as MediaServiceConfig);
    expect(service['_provider']).toBeInstanceOf(UnsplashService);
  });

  it('should not create a new provider if it already exists in the provider map', () => {
    service['_providerMap'].set(MediaProvidersEnum.PEXELS, pexelsService);
    service['_assignProvider']({ provider: MediaProvidersEnum.PEXELS } as MediaServiceConfig);
    expect(service['_provider']).toBe(pexelsService);
  });
});
