import { Fruit, Nullable } from '@shared/types';
import { tapResponse } from '@ngrx/operators';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { defer, map, of, pipe, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

export type RelatedFruitsState = {
  fruits: Fruit[];
  fruit: Nullable<Fruit>;
  maxSuggestions: number;
  loading: boolean;
  showAll: boolean;
  error: Nullable<string>;
}

const relatedFruitsInitialState: RelatedFruitsState = {
  fruits: [],
  fruit: null,
  maxSuggestions: 0,
  loading: false,
  showAll: false,
  error: null
}


export const RelatedFruitsStore = signalStore(
  withState(relatedFruitsInitialState),

  withComputed(state => {
    const filteredFruits = computed(() => state.fruits().filter(fruit => fruit.id !== state.fruit()?.id));

    const slicedFruits = computed(() => state.showAll() ? filteredFruits() : filteredFruits().slice(0, state.maxSuggestions()))

    const showLoadMoreBtn = computed(() => state.maxSuggestions() < filteredFruits().length);

    return { slicedFruits, showLoadMoreBtn };
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
    fetchFruits: rxMethod<Nullable<RelatedFruitsState['fruit']>>(
      pipe(
        tap((fruit) => patchState(store, {
          fruits: [],
          loading: true,
          fruit,
          error: null
        })),
        map(fruit => fruit?.family),
        switchMap(family => defer(() => family ? fruitService.getWithQuery({ family }) : of([])).pipe(
          tapResponse({
            next: fruits => patchState(store, { fruits }),
            error: (error: any) => {
              patchState(store, { error: "Errore nel caricamento dei suggerimenti" });
              console.error(error);
            },
            complete: () => patchState(store, { loading: false })
          })
        ))
      )
    )
  }))
);
