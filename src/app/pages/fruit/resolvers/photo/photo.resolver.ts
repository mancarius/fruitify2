import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { defer } from 'rxjs/internal/observable/defer';
import { of } from 'rxjs/internal/observable/of';
import { catchError } from 'rxjs/internal/operators/catchError';
import { finalize } from 'rxjs/internal/operators/finalize';
import { LoadingService } from '@shared/services/loading/loading.service';
import { MediaOrientation, MediaPhoto } from '@shared/types';
import { MediaService } from '@shared/services/media/media.service';

export const photoResolver: ResolveFn<MediaPhoto | null> = (route, state) => {
  const service = inject(MediaService);
  const loader = inject(LoadingService);
  const fruitName = route.params['fruitName'];

  loader.start();

  return defer(() => fruitName
    ? service.findPhoto(fruitName, {
      limit: 1,
      orientation: MediaOrientation.LANDSCAPE,
    })
    : of(null)
  ).pipe(
    finalize(() => loader.stop()),
    catchError((err: any) => {
      console.error('Failed to resolve photo:', err.message);
      return of(null);
    })
  );
};
