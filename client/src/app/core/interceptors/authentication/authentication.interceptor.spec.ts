import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, HttpInterceptorFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { authenticationInterceptor } from './authentication.interceptor';
import { AUTH_CONFIG_CONTEXT_TOKEN } from '@tokens';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('authenticationInterceptor', () => {
  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authenticationInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(withInterceptors([authenticationInterceptor])),
        provideHttpClientTesting(),
      ]
    });

    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add the authentication information to the request params', () => {
    const req = new HttpRequest('GET', 'http://example', {
      context: new HttpContext().set(AUTH_CONFIG_CONTEXT_TOKEN, [{
        addTo: 'params',
        key: 'api_key',
        value: '12345'
      }])
    });

    httpClient.get(req.url, { context: req.context }).subscribe();

    httpTesting.expectOne((req: HttpRequest<any>) => req.params.get('api_key') === '12345');

    expect().nothing();
  });

  it('should add the authentication information to the request headers', () => {
    const req = new HttpRequest('GET', 'http://example', {
      context: new HttpContext().set(AUTH_CONFIG_CONTEXT_TOKEN, [{
        addTo: 'headers',
        key: 'Authorization',
        authorizationType: 'Bearer',
        value: '12345'
      }])
    });

    httpClient.get(req.url, { context: req.context }).subscribe();

    httpTesting.expectOne((req: HttpRequest<any>) => req.headers.get('Authorization') === 'Bearer 12345');

    expect().nothing();
  });
});
