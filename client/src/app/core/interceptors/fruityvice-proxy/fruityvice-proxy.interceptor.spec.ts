import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { fruityviceProxyInterceptor } from './fruityvice-proxy.interceptor';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FRUITYVICE_PROXY_BASE_URL } from '@shared/constants';
import { environment } from '@env/environment';

describe('fruityviceProxyInterceptor', () => {
  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => fruityviceProxyInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(withInterceptors([fruityviceProxyInterceptor])),
        provideHttpClientTesting(),
        {
          provide: FRUITYVICE_PROXY_BASE_URL,
          useValue: 'https://example.com/api'
        }
      ]
    });

    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    environment.production = true;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should replace the base URL with the Fruityvice API url', async () => {
    const url = 'http://localhost:4200/api/fruit/all';
    const expected = 'https://example.com/api/fruit/all';

    const get$ = httpClient.get(url);
    const getPromise = firstValueFrom(get$);

    const req = httpTesting.expectOne(expected);
    req.flush(null);

    await getPromise;

    expect().nothing();
  });
});
