import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStateInit, tapResponse } from '@ngrx/component-store';
import { MediaService } from '@shared/services/media/media.service';
import { Fruit, MediaOptions, MediaOrientation, MediaPhoto, MediaSize, Nullable } from '@shared/types';
import { Observable, lastValueFrom, switchMap, tap } from 'rxjs';

type FruitPreviewState = {
  fruit: Nullable<Fruit>;
  photo: Nullable<MediaPhoto>;
  error: Nullable<Error>;
  loaded: boolean;
}

const initialState: FruitPreviewState = {
  fruit: null,
  photo: null,
  error: null,
  loaded: false,
}

@Injectable()
export class FruitPreviewStore extends ComponentStore<FruitPreviewState> implements OnStateInit {
  private readonly _mediaService = inject(MediaService);
  private readonly _photoDefaultOptions: Partial<MediaOptions> = {
    limit: 1,
    orientation: MediaOrientation.LANDSCAPE
  };

  constructor() { super(initialState) }

  ngrxOnStateInit() {
    this.fetchPhoto(this.select((state) => state.fruit?.name ?? ''));
  }

  /* ===== Selectors ===== */

  readonly vm = this.selectSignal((state) => ({
    fruitName: state.fruit?.name,
    imgUrl: state.photo?.url.sm,
    imgAlt: state.photo?.alt,
    loaded: state.loaded
  }));

  /* ===== Updaters ===== */

  readonly setFruit = this.updater((state, fruit: Nullable<Fruit>) => ({ ...state, fruit }));

  /* ===== Effects ===== */

  readonly fetchPhoto = this.effect((fruitName$: Observable<Fruit['name']>) => {
    return fruitName$.pipe(
      tap(() => this.patchState({ photo: null })),
      switchMap((fruitName) => this._findPhoto(fruitName)),
      tapResponse(
        (photo) => this.patchState({ photo, loaded: true }),
        (error: any) => {
          console.error(error);
          this.patchState({ error, loaded: false });
        }
      ),
    );
  });


  /* ===== Private Methods ===== */

  /**
   * Finds the photo for a given fruit.
   * @param fruitName - The fruit name to find the photo for.
   * @returns An observable that emits the photo if found, or null if not found.
   */
  private async _findPhoto(fruitName: Nullable<Fruit['name']>): Promise<Nullable<MediaPhoto>> {
    if (!fruitName) return null;
    return lastValueFrom(this._mediaService.findPhoto(fruitName, this._photoDefaultOptions));
  }
}
