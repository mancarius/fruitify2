import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { Fruit, Nullable, SearchContext } from "@shared/types";
import { Observable, tap } from "rxjs";

export type FruitsState = {
  fruits: Fruit[];
};

export const initialState: FruitsState = {
  fruits: [],
};

export const fruitsStore = signalStore(
  withState(initialState),

  withMethods((store, router = inject(Router)) => ({
    setFruits: rxMethod<Fruit[]>((fruits$) =>
      fruits$.pipe(
        tap((fruits) => {
          patchState(store, { fruits });
        }),
      ),
    ),

    search: rxMethod(
      (query$: Observable<Partial<Record<SearchContext, Nullable<string>>> | null>) => {
        return query$.pipe(
          tap((query) => {
            const queryParams = query ?? {};
            router.navigate(["/fruits"], { queryParams });
          }),
        );
      },
    ),
  })),
);
