import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandlerFn, HttpInterceptorFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { fruityviceProxyInterceptor } from './fruityvice-proxy.interceptor';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('fruityviceProxyInterceptor', () => {
  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;
  let next: HttpHandlerFn;
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => fruityviceProxyInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([fruityviceProxyInterceptor])),
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

  it('should replace the base URL with the Fruityvice API url', async () => {
    const req = new HttpRequest('GET', 'http://localhost:4200/api/fruit/all');
    const expected = 'https://fruityvice.com/api/fruit/all';

    httpClient.get(req.url).subscribe();

    httpTesting.expectOne(expected);

    expect().nothing();
  });
});
