import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { addHeader, addParam, setRequestAuth } from './authentication.utils';
import { ApiAuthConfig } from '@shared/types';

describe('Authentication interceptor utils', () => {

  describe('addHeader', () => {

    it('should add a header to the given headers object based on the provided configuration', () => {
      // Arrange
      const headers = new HttpHeaders();
      const config: ApiAuthConfig = {
        addTo: 'headers',
        key: 'Authorization',
        authorizationType: 'Bearer',
        value: '12345'
      };
      // Act
      const result = addHeader(headers, config);
      // Assert
      expect(result.get('Authorization')).toBe('Bearer 12345');
    });

  });


  describe('addParam', () => {

    it('should add a parameter to the URLSearchParams object', () => {
      // Arrange
      const params = new HttpParams();
      const config: ApiAuthConfig = {
        addTo: 'params',
        key: 'api_key',
        value: '12345'
      };
      // Act
      const result = addParam(params, config);
      // Assert
      expect(result.get('api_key')).toBe('12345');
    });

  });


  describe('setRequestAuth', () => {
    let req: HttpRequest<any>;

    beforeEach(() => {
      req = new HttpRequest('GET', 'http://example');
    });

    it('should set the authentication information in the request headers or URL parameters based on the provided configuration', () => {
      // Arrange
      const authConfigs: ApiAuthConfig[] = [{
        addTo: 'headers',
        key: 'Authorization',
        authorizationType: 'Bearer',
        value: '12345'
      }];
      // Act
      const result = setRequestAuth(req, authConfigs);
      // Assert
      expect(result.headers.get('Authorization')).toBe('Bearer 12345');
    });

    it('should set the authentication information in the request params based on the provided configuration', () => {
      // Arrange
      const authConfigs: ApiAuthConfig[] = [{
        addTo: 'params',
        key: 'api_key',
        value: '12345'
      }];
      // Act
      const result = setRequestAuth(req, authConfigs);
      // Assert
      expect(result.params.get('api_key')).toBe('12345');
    });

  });

});