import { inject } from '@angular/core';
import { Params, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { catchError, iif, finalize, of, map } from 'rxjs';
import { Fruit, QueryParams } from '@shared/types';
import { LoadingService } from '@shared/services/loading/loading.service';

export const fruitsResolver: ResolveFn<Fruit[]> = (route, state) => {
  const service = inject(FruitService);
  const loader = inject(LoadingService);
  const query = route.queryParams as Params & QueryParams<keyof Omit<Fruit, 'nutritions' | 'id'>>;
  const router = inject(Router);

  loader.start();

  return iif(
    () => Object.keys(query).length > 0,
    service.getWithQuery(query),
    service.getAll()
  ).pipe(
    map((fruits) => fruits.sort((a, b) => a.name.localeCompare(b.name))),
    finalize(() => loader.stop()),
    catchError((err: any) => {
      console.error('Failed to retrieve fruits', err);
      const errorPath = router.parseUrl('/error');
      return of(new RedirectCommand(errorPath, {
        skipLocationChange: true,
      }));
    })
  );
};
