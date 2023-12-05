import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { defer, finalize, map } from 'rxjs';
import { Fruit, QueryParams } from '@shared/types';
import { LoadingService } from '@shared/services/loading/loading.service';

export const fruitResolver: ResolveFn<Fruit[]> = (route, state) => {
  const service = inject(FruitService);
  const loader = inject(LoadingService);
  const fruitId = route.paramMap.get('id');
  const query = route.queryParamMap as QueryParams<keyof Omit<Fruit, 'nutritions' | 'id'>>;

  loader.start();

  return defer(() => {
    if (fruitId) {
      return service.getById(Number(fruitId)).pipe(map((fruit) => [fruit]));
    }

    if (Object.keys(query).length) {
      return service.getWithQuery(query);
    }

    return service.getAll();
  }).pipe(
    finalize(() => loader.stop())
  );
};
