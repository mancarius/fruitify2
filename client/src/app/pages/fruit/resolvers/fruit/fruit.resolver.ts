import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { catchError, defer, finalize, of } from 'rxjs';
import { Fruit } from '@shared/types';
import { LoadingService } from '@shared/services/loading/loading.service';

export const fruitResolver: ResolveFn<Fruit | null> = (route, state) => {
  const service = inject(FruitService);
  const loader = inject(LoadingService);
  const fruitId = route.queryParamMap.get('fruitId');
  const router = inject(Router);

  loader.start();

  return defer(() => fruitId
    ? service.getById(Number(fruitId))
    : of(null)
  ).pipe(
    finalize(() => loader.stop()),
    catchError((err: any) => {
      console.error('Failed to retrieve fruit', err);
      const errorPath = router.parseUrl('/error');
      return of(new RedirectCommand(errorPath, {
        skipLocationChange: true,
      }));
    })
  );
};
