import { MediaProvidersEnum, MediaServiceConfig } from '../types';
import { PexelsService } from '../services/pexels/pexels.service';
import { HttpClient } from '@angular/common/http';
import { MediaService } from '../services/media/media.service';
import { UnsplashService } from '@shared/services/unsplash/unsplash.service';
import { AbstractMediaProviderService } from '@shared/services/abstract-provider/abstract-provider.service';


/**
 * Factory function for creating a media service.
 * @param mediaServiceConfig - The configuration for the API service.
 * @param http - The HttpClient instance.
 * @returns A media service instance.
 */
export function mediaServiceFactory(mediaServiceConfig: MediaServiceConfig, http: HttpClient): MediaService {
  let mediaProvider: AbstractMediaProviderService;
  
  switch (mediaServiceConfig.provider) {
    case MediaProvidersEnum.PEXELS:
      mediaProvider = new PexelsService(mediaServiceConfig, http);
      break;
    case MediaProvidersEnum.UNSPLASH:
      mediaProvider = new UnsplashService(mediaServiceConfig, http);
      break;
    default:
      throw new Error(`Media provider '${mediaServiceConfig.provider}' not supported.`);
  }

  return new MediaService(mediaProvider);
}