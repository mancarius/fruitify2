import { MediaProvidersEnum, MediaServiceConfig } from '../types';
import { PexelsService } from '../services/pexels/pexels.service';
import { HttpClient } from '@angular/common/http';
import { MediaService } from '../services/media/media.service';
import { UnsplashService } from '@shared/services/unsplash/unsplash.service';
import { AbstractMediaProviderService } from '@shared/services/abstract-media-provider/abstract-media-provider.service';
import { BehaviorSubject } from 'rxjs';


/**
 * Factory function for creating a media service.
 * @param mediaServiceConfig - The configuration for the API service.
 * @param http - The HttpClient instance.
 * @returns A media service instance.
 */
export function mediaServiceFactory(mediaServiceConfig: BehaviorSubject<MediaServiceConfig>, http: HttpClient): MediaService {
  const provider = mediaServiceConfig.value.provider;
  let mediaProvider: AbstractMediaProviderService;
  
  switch (provider) {
    case MediaProvidersEnum.PEXELS:
      mediaProvider = new PexelsService(mediaServiceConfig.value, http);
      break;
    case MediaProvidersEnum.UNSPLASH:
      mediaProvider = new UnsplashService(mediaServiceConfig.value, http);
      break;
    default:
      throw new Error(`Media provider '${provider}' not supported.`);
  }

  return new MediaService(mediaProvider);
}