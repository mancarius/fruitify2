import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, defer, finalize, of } from 'rxjs';
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
    catchError(() => of(null))
  );
};
