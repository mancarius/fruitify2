import { inject } from '@angular/core';
import { Params, ResolveFn } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { defer, finalize } from 'rxjs';
import { Fruit, QueryParams } from '@shared/types';
import { LoadingService } from '@shared/services/loading/loading.service';

export const fruitsResolver: ResolveFn<Fruit[]> = (route, state) => {
  const service = inject(FruitService);
  const loader = inject(LoadingService);
  const query = route.queryParams as Params & QueryParams<keyof Omit<Fruit, 'nutritions' | 'id'>>;

  loader.start();

  return defer(() => {
    if (Object.keys(query).length) {
      return service.getWithQuery(query);
    }

    return service.getAll();
  }).pipe(
    finalize(() => loader.stop())
  );
};