import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { fruitResolver } from './fruit.resolver';
import { Fruit, Nullable } from '@shared/types';

describe('fruitResolver', () => {
  const executeResolver: ResolveFn<Nullable<Fruit>> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => fruitResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
