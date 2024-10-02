import { inject, computed, effect, untracked } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import {
  signalStore,
  withMethods,
  withState,
  patchState,
  withComputed,
  withHooks,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { MediaService } from "@shared/services/media/media.service";
import { Fruit, MediaPhoto, MediaSize, Nullable } from "@shared/types";
import { lastValueFrom, pipe, switchMap, tap } from "rxjs";
import { PHOTO_DEFAULT_OPTIONS } from "@tokens";

type FruitPreviewState = {
  fruit: Nullable<Fruit>;
  photo: Nullable<MediaPhoto>;
  error: Nullable<string>;
  loaded: boolean;
};

const initialState: FruitPreviewState = {
  fruit: null,
  photo: null,
  error: null,
  loaded: false,
};

export const FruitPreviewStore = signalStore(
  withState(initialState),

  withComputed((state) => ({
    fruitName: computed(() => state.fruit()?.name ?? null),
    imgUrl: computed(() => state.photo()?.url[MediaSize.SMALL]),
    imgAlt: computed(() => state.photo()?.alt),
  })),

  withMethods((store) => ({
    setFruit: (fruit: Nullable<Fruit>) => patchState(store, { fruit }),
  })),

  withMethods(
    (
      store,
      mediaService = inject(MediaService),
      photoDefaultOptions = inject(PHOTO_DEFAULT_OPTIONS),
    ) => ({
      fetchPhoto: rxMethod<Nullable<Fruit["name"]>>(
        pipe(
          tap(() => patchState(store, { photo: null })),
          switchMap(async (fruitName) => {
            if (!fruitName) return null;
            return lastValueFrom(
              mediaService.findPhoto(fruitName, photoDefaultOptions),
            );
          }),
          tapResponse(
            (photo) => patchState(store, { photo, loaded: true }),
            (error: any) => {
              console.error(error);
              patchState(store, {
                error: "Errore nel caricamento della foto",
                loaded: false,
              });
            },
          ),
        ),
      ),
    }),
  ),

  withHooks({
    onInit(store) {
      effect(() => {
        const fruitName = store.fruitName();
        untracked(() => store.fetchPhoto(fruitName));
      });
    },
  }),
);
