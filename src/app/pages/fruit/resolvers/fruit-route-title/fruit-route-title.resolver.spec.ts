import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

import { fruitRouteTitleResolver } from './fruit-route-title.resolver';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('fruitRouteTitleResolver', () => {
  const executeResolver: ResolveFn<string> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fruitRouteTitleResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection()
      ]
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should return the title for the fruit route', () => {
    const route = {
      params: {
        fruitName: 'apple'
      }
    } as unknown as ActivatedRouteSnapshot;
    const state = {} as unknown as RouterStateSnapshot;

    const title = executeResolver(route, state);
    expect(title).toBe('Apple - Fruitify');
  });
});
