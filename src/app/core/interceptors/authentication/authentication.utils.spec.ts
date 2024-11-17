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

    it('should handle headers without authorizationType', () => {
      // Arrange
      const headers = new HttpHeaders();
      const config = {
        addTo: 'headers',
        key: 'Custom-Header',
        value: '67890'
      } as any;
      // Act
      const result = addHeader(headers, config);
      // Assert
      expect(result.get('Custom-Header')).toBe('67890');
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

    it('should handle params with empty value', () => {
      // Arrange
      const params = new HttpParams();
      const config: ApiAuthConfig = {
        addTo: 'params',
        key: 'empty_param',
        value: ''
      };
      // Act
      const result = addParam(params, config);
      // Assert
      expect(result.get('empty_param')).toBe('');
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

    it('should handle multiple authConfigs for headers and params', () => {
      // Arrange
      const authConfigs: ApiAuthConfig[] = [
        {
          addTo: 'headers',
          key: 'Authorization',
          authorizationType: 'Bearer',
          value: '12345'
        },
        {
          addTo: 'params',
          key: 'api_key',
          value: '67890'
        }
      ];
      // Act
      const result = setRequestAuth(req, authConfigs);
      // Assert
      expect(result.headers.get('Authorization')).toBe('Bearer 12345');
      expect(result.params.get('api_key')).toBe('67890');
    });

    it('should handle empty authConfigs array', () => {
      // Arrange
      const authConfigs: ApiAuthConfig[] = [];
      // Act
      const result = setRequestAuth(req, authConfigs);
      // Assert
      expect(result.headers.keys().length).toBe(0);
      expect(result.params.keys().length).toBe(0);
    });

  });

});
