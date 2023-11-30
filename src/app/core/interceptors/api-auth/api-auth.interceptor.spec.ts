import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { API_AUTH_CONFIG } from '@tokens/api';
import { apiAuthInterceptor } from './api-auth.interceptor';
import { BehaviorSubject } from 'rxjs';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiAuthConfig } from '@shared/types/api-auth-config';

fdescribe('apiAuthInterceptor', () => {
  let apiAuthConfigToken: BehaviorSubject<ApiAuthConfig>;
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [

      ],
      providers: [
        provideHttpClient(withInterceptors([apiAuthInterceptor])),
        provideHttpClientTesting(),
        {
          provide: API_AUTH_CONFIG,
          useFactory: () => new BehaviorSubject(null)
        }
      ]
    });

    apiAuthConfigToken = TestBed.inject(API_AUTH_CONFIG);
    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add authorization header to the request if addTo is "headers"', () => {
    const apiAuthConfig: ApiAuthConfig = {
      match: 'example.com',
      addTo: 'headers',
      key: 'Authorization',
      authorizationType: 'Bearer',
      value: 'token'
    };
    const url = "https://example.com/photos/random";

    apiAuthConfigToken.next(apiAuthConfig);
    httpClient.get(url).subscribe();

    httpTesting.expectOne((req) => {
      return req.headers.has('Authorization') &&
        req.headers.get('Authorization') === `${apiAuthConfig.authorizationType} ${apiAuthConfig.value}`;
    });

    expect().nothing();
  });

  it('should add parameter to the request if addTo is "params"', () => {
    const apiAuthConfig: ApiAuthConfig = {
      match: 'example.com',
      addTo: 'params',
      key: 'token',
      value: 'token'
    };
    const url = "https://example.com/photos/random";

    apiAuthConfigToken.next(apiAuthConfig);
    httpClient.get(url).subscribe();

    httpTesting.expectOne((req) => {
      return req.params.has('token') &&
        req.params.get('token') === apiAuthConfig.value;
    });

    expect().nothing();
  });

  it('should not add authorization header to the request if addTo is "headers" and the request does not match the config', () => {
    const apiAuthConfig: ApiAuthConfig = {
      match: 'example.com',
      addTo: 'headers',
      key: 'Authorization',
      authorizationType: 'Bearer',
      value: 'token'
    };
    const url = "https://example-1.com/api";

    apiAuthConfigToken.next(apiAuthConfig);
    httpClient.get(url).subscribe();

    httpTesting.expectOne((req) => {
      return !req.headers.has('Authorization');
    });

    expect().nothing();
  });

  it('should not add parameter to the request if addTo is "params" and the request does not match the config', () => {
    const apiAuthConfig: ApiAuthConfig = {
      match: 'example.com',
      addTo: 'params',
      key: 'token',
      value: 'token'
    };
    const url = "https://example-1.com/api";

    apiAuthConfigToken.next(apiAuthConfig);
    httpClient.get(url).subscribe();

    httpTesting.expectOne((req) => {
      return !req.params.has('token');
    });

    expect().nothing();
  });
});
