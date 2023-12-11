import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { catchError, defer, finalize, of } from 'rxjs';
import { Fruit } from '@shared/types';
import { LoadingService } from '@shared/services/loading/loading.service';

export const fruitResolver: ResolveFn<Fruit | null> = (route, state) => {
  const service = inject(FruitService);
  const loader = inject(LoadingService);
  const fruitId = route.queryParamMap.get('fruitId');

  loader.start();

  return defer(() => fruitId
    ? service.getById(Number(fruitId))
    : of(null)
  ).pipe(
    finalize(() => loader.stop()),
    catchError(() => of(null))
  );
};
