import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting, provideHttpClientTesting } from '@angular/common/http/testing';
import { FruitService } from './fruit.service';
import { firstValueFrom } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FruitService', () => {
  let service: FruitService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        FruitService,
        provideHttpClientTesting(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(FruitService);
    httpTesting = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    httpTesting.verify();
  });



  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a base URL', () => {
    expect(service['_baseUrl']).toBeTruthy();
  });



  describe('_composeUrl', () => {

    it('should exists', () => {
      expect(service['_composeUrl']).toBeTruthy();
    });

    it('should return the base URL when the key is not included in the keyList', () => {
      const key = 'key';
      const url = service['_composeUrl'](key);
      const expectedUrl = service['_baseUrl'];

      expect(url).toEqual(expectedUrl);
    });

    it('should return the base URL with the key appended when the key is included in the keyList', () => {
      const key = 'all';
      const url = service['_composeUrl'](key);
      const expectedUrl = `${service['_baseUrl']}/${key}`;

      expect(url).toEqual(expectedUrl);
    });

  });



  describe('_getAll', () => {

    it('should exists', () => {
      expect(service.getAll).toBeTruthy();
    });

    it('should make a GET request to the correct URL', () => {
      const expectedUrl = service['_composeUrl']('all');

      const fruits$ = service.getAll();
      const fruitsPromise = firstValueFrom(fruits$);

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush([]);
    });
    
  });



  describe('_getById', () => {

    it('should exists', () => {
      expect(service.getById).toBeTruthy();
    });

    it('should make a GET request to the correct URL', () => {
      const id = 1;
      const expectedUrl = `${service['_composeUrl']()}/${id}`;

      const fruit$ = service.getById(id);
      const fruitPromise = firstValueFrom(fruit$);

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush({});
    });
    
  });



  describe('_getWithQuery', () => {

    it('should exists', () => {
      expect(service.getWithQuery).toBeTruthy();
    });

    it('should make a single GET request to the correct URL', () => {
      const query = { name: 'banana' };
      const expectedUrl = `${service['_composeUrl']('key')}/${query.name}`;

      const fruits$ = service.getWithQuery(query);
      const fruitsPromise = firstValueFrom(fruits$);

      const req = httpTesting.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush([]);
    });

    it('should make multiple GET requests to the correct URLs', () => {
      const query = { family: 'Musaceae', genus: 'Musa' };
      const expectedUrl1 = `${service['_composeUrl']('family')}/${query.family}`;
      const expectedUrl2 = `${service['_composeUrl']('genus')}/${query.genus}`;

      service.getWithQuery(query).subscribe();

      const req1 = httpTesting.expectOne(expectedUrl1);
      const req2 = httpTesting.expectOne(expectedUrl2);
      expect(req1.request.method).toEqual('GET');
      expect(req2.request.method).toEqual('GET');

      req1.flush([]);
      req2.flush([]);
    });
    
  });
});
