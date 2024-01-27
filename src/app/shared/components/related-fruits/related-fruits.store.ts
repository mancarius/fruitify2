import { Fruit, Nullable } from '@shared/types';
import { ComponentStore, OnStateInit, tapResponse } from '@ngrx/component-store';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { Observable, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

export type RelatedFruitsState = {
  fruits: Fruit[];
  fruit: Nullable<Fruit>;
  maxSuggestions: number;
}

const relatedFruitsInitialState: RelatedFruitsState = {
  fruits: [],
  fruit: null,
  maxSuggestions: -1
}


@Injectable()
export class RelatedFruitsStore extends ComponentStore<RelatedFruitsState> implements OnStateInit {
  constructor(private readonly _fruitService: FruitService) {
    super(relatedFruitsInitialState);
  }

  readonly fruits$ = this.select(state => state.fruits.slice(0, state.maxSuggestions).filter(fruit => fruit.id !== state.fruit?.id));
  readonly family$ = this.select(state => state.fruit?.family ?? null);

  ngrxOnStateInit() {
    this.fetchFruits(this.family$);
  }

  /* ========== Updaters ========== */

  readonly setFruits = this.updater((state, fruits: Fruit[]) => ({
    ...state,
    fruits
  }));
  
  readonly setFruit = this.updater((state, fruit: Nullable<Fruit>) => ({
    ...state,
    fruit: fruit
  }));
  
  readonly setMaxSuggestions = this.updater((state, max: number) => ({
    ...state,
    max
  }));

  /* ========== Effects ========== */

  readonly fetchFruits = this.effect((family$: Observable<Nullable<Fruit['family']>>) => {
    return family$.pipe(
      switchMap(family => family ? this._fruitService.getWithQuery({ family }) : of([])),
      tapResponse(
        fruits => this.setFruits(fruits),
        error => console.error(error)
      )
    );
  });
}