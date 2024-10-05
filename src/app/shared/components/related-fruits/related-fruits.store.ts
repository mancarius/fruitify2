import { Fruit, Nullable } from '@shared/types';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { catchError, defer, distinctUntilChanged, map, of, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { SHOW_MORE_BUTTON_TEXT } from '@tokens';

export type RelatedFruitsState = {
  fruits: Fruit[];
  fruit: Nullable<Fruit>;
  maxSuggestions: number;
  loading: boolean;
  showAll: boolean;
  error: Nullable<string>;
}

const initialState: RelatedFruitsState = {
  fruits: [],
  fruit: null,
  maxSuggestions: 0,
  loading: false,
  showAll: false,
  error: null
}


export const RelatedFruitsStore = signalStore(
  withState(initialState),

  withComputed((state, buttonTextMap = inject(SHOW_MORE_BUTTON_TEXT)) => {
    const filteredFruits = computed(() => state.fruits().filter(fruit => fruit.id !== state.fruit()?.id));

    const slicedFruits = computed(() => state.showAll() ? filteredFruits() : filteredFruits().slice(0, state.maxSuggestions()))

    const showLoadMoreBtn = computed(() => state.maxSuggestions() < filteredFruits().length);

    const buttonText = computed(() => state.showAll() ? buttonTextMap.closeText : buttonTextMap.openText);

    return { slicedFruits, showLoadMoreBtn, buttonText };
  }),

  withMethods(store => ({
    setFruits(fruits: RelatedFruitsState['fruits']): void {
      patchState(store, { fruits })
    },
    setMaxSuggestion: rxMethod<RelatedFruitsState['maxSuggestions']>(
      pipe(
        tap(value => { patchState(store, { maxSuggestions: value }) })
      )
    ),
    toggleShowAll(): void {
      patchState(store, state => ({ showAll: !state.showAll }))
    },
  })),
  withMethods((store, fruitService = inject(FruitService)) => ({
    fetchFruits: rxMethod<RelatedFruitsState['fruit']>(
      pipe(
        distinctUntilChanged((prev, next) => prev?.id === next?.id),
        tap((fruit) => patchState(store, {
          fruits: [],
          loading: true,
          fruit,
          error: null
        })),
        map(fruit => fruit?.family),
        switchMap(family => defer(() => family ? fruitService.getWithQuery({ family }) : of([])).pipe(
          catchError((error) => {
            patchState(store, { error: "Errore nel caricamento dei suggerimenti" });
            console.error("Errore nel caricamento dei suggerimenti", error);
            return of([]);
          }),
          tap(fruits => patchState(store, { fruits })),
          tap(() => patchState(store, { loading: false }))
        )),
      )
    )
  }))
);
