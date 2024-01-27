import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { fruitRouteTitleResolver } from './fruit-route-title.resolver';

describe('fruitRouteTitleResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => fruitRouteTitleResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
