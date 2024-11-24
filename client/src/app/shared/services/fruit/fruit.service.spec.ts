import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FruitService } from './fruit.service';
import { Fruit } from '@shared/types';
import { API_BASE_PATHNAME } from '@tokens';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { firstValueFrom } from 'rxjs';

describe('FruitService', () => {
  let service: FruitService;
  let httpMock: HttpTestingController;

  const mockFruits: Fruit[] = [
    { id: 1, name: 'Apple', genus: 'Malus', family: 'Rosaceae', order: 'Rosales', nutritions: { /* mock nutrition data */ } as Fruit['nutritions'] },
    { id: 2, name: 'Banana', genus: 'Musa', family: 'Musaceae', order: 'Zingiberales', nutritions: { /* mock nutrition data */ } as Fruit['nutritions'] },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FruitService,
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: API_BASE_PATHNAME, useValue: 'http://mock-api.com' }
      ]
    });

    service = TestBed.inject(FruitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all fruits', async () => {
    const fruits$ = service.getAll();
    const fruitsPromise = firstValueFrom(fruits$);


    const req = httpMock.expectOne('http://mock-api.com/fruits/all');
    expect(req.request.method)
      .withContext('Expected request method to be GET')
      .toBe('GET');
    req.flush(mockFruits);

    const fruits = await fruitsPromise;

    expect(fruits.length)
      .withContext('Expected 2 fruits to be retrieved')
      .toBe(2);
    expect(fruits[0].name)
      .withContext('Expected the first fruit to be an Apple')
      .toBe('Apple');
    expect(fruits[1].name)
      .withContext('Expected the second fruit to be a Banana')
      .toBe('Banana');
  });

  it('should retrieve a fruit by ID', async () => {
    const mockFruit = mockFruits[0];

    const fruit$ = service.getById(1);
    const fruitPromise = firstValueFrom(fruit$);

    const req = httpMock.expectOne('http://mock-api.com/fruits/1');
    expect(req.request.method)
      .withContext('Expected request method to be GET')
      .toBe('GET');
    req.flush(mockFruit);

    const fruit = await fruitPromise;

    expect(fruit)
      .withContext('Expected the retrieved fruit to be an Apple')
      .toEqual(mockFruit);
  });

  it('should retrieve fruits with query parameters', async () => {
    const query = { genus: 'Malus' };

    const fruits$ = service.getWithQuery(query);

    const fruitsPromise = firstValueFrom(fruits$);

    const req = httpMock.expectOne('http://mock-api.com/fruits/genus/Malus');
    expect(req.request.method)
      .withContext('Expected request method to be GET')
      .toBe('GET');
    req.flush([mockFruits[0]]);

    const fruits = await fruitsPromise;

    expect(fruits.length)
      .withContext('Expected 1 fruit to be retrieved')
      .toBe(1);
    expect(fruits[0].name)
      .withContext('Expected the retrieved fruit to be an Apple')
      .toBe('Apple');
  });
});
