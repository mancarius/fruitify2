import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { Fruit } from '@shared/types';
import { fruitsResolver } from './fruits.resolver';

describe('fruitsResolver', () => {
  const executeResolver: ResolveFn<Fruit[]> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => fruitsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
