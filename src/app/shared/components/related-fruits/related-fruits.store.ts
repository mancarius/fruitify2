import { Fruit, Nullable } from '@shared/types';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { Observable, defer, distinctUntilChanged, of, shareReplay, switchMap, tap } from 'rxjs';
import { Injectable, inject } from '@angular/core';

export type RelatedFruitsState = {
  fruits: Fruit[];
  fruit: Nullable<Fruit>;
  maxSuggestions: number;
  loading: boolean;
}

const relatedFruitsInitialState: RelatedFruitsState = {
  fruits: [],
  fruit: null,
  maxSuggestions: -1,
  loading: false
}


@Injectable()
export class RelatedFruitsStore extends ComponentStore<RelatedFruitsState> implements OnStateInit {
  readonly #fruitService = inject(FruitService);

  constructor() { super(relatedFruitsInitialState) }

  readonly fruits$ = this.select(state => state.fruits
    .filter(fruit => fruit.id !== state.fruit?.id)
    .slice(0, state.maxSuggestions)
  ).pipe(shareReplay(1));
  readonly loading$ = this.select(state => state.loading);
  readonly family$ = this.select(state => state.fruit?.family ?? null).pipe(distinctUntilChanged(), shareReplay(1));

  ngrxOnStateInit() {
    this.fetchFruits(this.family$);
  }

  /* ========== Updaters ========== */

  readonly setFruits = this.updater((state, fruits: RelatedFruitsState['fruits']) => ({
    ...state,
    fruits: fruits.filter(fruit => fruit.id !== state.fruit?.id)
  }));

  readonly setFruit = this.updater((state, fruit: RelatedFruitsState['fruit']) => ({
    ...state,
    fruit
  }));

  readonly setMaxSuggestions = this.updater((state, maxSuggestions: RelatedFruitsState['maxSuggestions']) => ({
    ...state,
    maxSuggestions
  }));

  /** Show all suggestions */
  readonly showAll = this.updater((state) => ({
    ...state,
    maxSuggestions: state.fruits.length
  }));

  /* ========== Effects ========== */

  readonly fetchFruits = this.effect((family$: Observable<Nullable<Fruit['family']>>) => {
    return family$.pipe(
      tap(() => this.patchState({
        fruits: [],
        loading: true
      })),
      switchMap(family => defer(() => family ? this.#fruitService.getWithQuery({ family }) : of([])).pipe(
        tapResponse(
          fruits => this.setFruits(fruits),
          error => console.error(error),
          () => this.patchState({ loading: false })
        )
      ))
    );
  });
}