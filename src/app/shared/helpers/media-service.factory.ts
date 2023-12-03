import { MediaProvidersEnum, MediaServiceConfig } from '../types';
import { PexelsService } from '../services/pexels/pexels.service';
import { HttpClient } from '@angular/common/http';
import { MediaService } from '../services/media/media.service';
import { UnsplashService } from '@shared/services/unsplash/unsplash.service';


/**
 * Factory function for creating a media service.
 * @param mediaServiceConfig - The configuration for the API service.
 * @param http - The HttpClient instance.
 * @returns A media service instance.
 */
export function mediaServiceFactory(mediaServiceConfig: MediaServiceConfig, http: HttpClient): MediaService {
  switch (mediaServiceConfig.provider) {
    case MediaProvidersEnum.PEXELS:
      return new PexelsService(mediaServiceConfig, http);
    case MediaProvidersEnum.UNSPLASH:
      return new UnsplashService(mediaServiceConfig, http);
    default:
      throw new Error(`Media provider '${mediaServiceConfig.provider}' not supported.`);
  }
}