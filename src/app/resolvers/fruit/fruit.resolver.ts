import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { defer, finalize, of } from 'rxjs';
import { Fruit } from '@shared/types';
import { LoadingService } from '@shared/services/loading/loading.service';

export const fruitResolver: ResolveFn<Fruit|null> = (route, state) => {
  const service = inject(FruitService);
  const loader = inject(LoadingService);
  const fruitId = route.paramMap.get('id');

  loader.start();

  return defer(() => {
    if (fruitId) {
      return service.getById(Number(fruitId));
    }

    return of(null);
  }).pipe(
    finalize(() => loader.stop())
  );
};
