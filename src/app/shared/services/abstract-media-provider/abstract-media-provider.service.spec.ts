import { AbstractMediaProviderService } from './abstract-media-provider.service';
import { MediaOptions, MediaOrientation, MediaServiceConfig } from '@shared/types';

class MockMediaProviderService extends AbstractMediaProviderService {
  constructor(config: MediaServiceConfig) {
    super(config);
  }

  findPhoto(_query: string): any {
    throw new Error('Method not implemented.');
  }
}

describe('AbstractMediaProviderService', () => {
  let service: AbstractMediaProviderService;
  const mockConfig = {
    provider: 'EXAMPLE_PROVIDER',
    baseUrl: 'http://example.com',
  } as unknown as MediaServiceConfig;

  beforeEach(() => {
    service = new MockMediaProviderService(mockConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the correct media provider name', () => {
    // Arrange
    const expectedProviderName = mockConfig.provider;

    // Act
    const actualProviderName = service.providerName;

    // Assert
    expect(actualProviderName)
      .withContext('The provider name should be the one provided in the config')
      .toBe(expectedProviderName);
  });

  it('should have the correct default values for defaultQueryOptions', () => {
    const expectedOptions: MediaOptions = {
      page: 1,
      per_page: 10,
      limit: 10,
      orientation: MediaOrientation.LANDSCAPE
    };
    expect(service.defaultQueryOptions)
      .withContext('The default query options should be the ones provided in the config')
      .toEqual(expectedOptions);
  });

  it('should compose the correct URL', () => {
    const pathname = '/photos';
    const expectedUrl = new URL(mockConfig.baseUrl + pathname);
    const result = service['composeUrl'](pathname);
    expect(result.href)
      .withContext('The composed URL should be the base URL with the given pathname')
      .toBe(expectedUrl.href);
  });
});
