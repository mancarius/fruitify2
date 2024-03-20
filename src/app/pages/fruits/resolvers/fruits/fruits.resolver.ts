import { inject } from '@angular/core';
import { Params, ResolveFn } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { catchError, defer, finalize, of } from 'rxjs';
import { Fruit, QueryParams } from '@shared/types';
import { LoadingService } from '@shared/services/loading/loading.service';

export const fruitsResolver: ResolveFn<Fruit[]> = (route, state) => {
  const service = inject(FruitService);
  const loader = inject(LoadingService);
  const query = route.queryParams as Params & QueryParams<keyof Omit<Fruit, 'nutritions' | 'id'>>;

  loader.start();

  return defer(() => Object.keys(query).length
    ? service.getWithQuery(query)
    : service.getAll()
  ).pipe(
    finalize(() => loader.stop()),
    catchError(() => of([]))
  );
};