import { Injectable } from '@angular/core';
import { Fruit, QueryParams } from "../../types";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { FruitService } from '../../services/fruit/fruit.service';
import { Observable, map, switchMap, tap } from 'rxjs';
import { LoadingService } from '../../services/loading/loading.service';
import { HttpErrorResponse } from '@angular/common/http';

export type FruitState = {
  fruits: Fruit[];
  loading: boolean;
  error: string|null;
}

export const fruitInitialState: FruitState = {
  fruits: [],
  loading: false,
  error: null,
};

@Injectable()
export class FruitStore extends ComponentStore<FruitState> {

  constructor(private _fruitService: FruitService, private _loadingService: LoadingService) {
    super(fruitInitialState);
  }

  /* ========== Selectors ========== */

  /**
   * Observable that emits the current state of the fruits in the store.
   */
  readonly fruits$ = this.select((state) => state.fruits);

  /**
   * Observable that emits the current loading state in the store.
   */
  readonly loading$ = this.select((state) => state.loading);

  /**
   * Observable that emits the current error in the store.
   */
  readonly error$ = this.select((state) => state.error);

  /* ========== Updaters ========== */

  private readonly _startLoading = this.updater((state) => ({ ...state, loading: true }));
  private readonly _stopLoading = this.updater((state) => ({ ...state, loading: false }));

  /* ========== Effects ========== */

  /**
   * Fetches all fruits from the fruit service and updates the state with the fetched fruits.
   * @returns An observable that emits the fetched fruits.
   */
  readonly fetchAllFruits = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() => this._startLoading()),
      switchMap(() => this._fruitService.getAll()),
      tap(() => this._stopLoading()),
      tapResponse(
        (fruits) => {
          fruits.sort((a, b) => a.name.localeCompare(b.name));
          this.patchState({ fruits })
        },
        (error: HttpErrorResponse) => this.patchState({ error: error.message }),
      ),
    );
  });

  /**
   * Retrieves fruits by name.
   * @param name - A strings representing the fruit names.
   * @returns An observable that emits the retrieved fruits.
   */
  readonly getFruitsByQuery = this.effect((queryParams$: Observable<QueryParams<keyof Fruit>>) => {
    return queryParams$.pipe(
      tap(() => this._startLoading()),
      switchMap((queryParams) => this._fruitService.getWithQuery(queryParams)),
      tap(() => this._stopLoading()),
      tapResponse(
        (fruits) => {
          fruits.sort((a, b) => a.name.localeCompare(b.name))
          this.patchState({ fruits })
        },
        (error: HttpErrorResponse) => this.patchState({ error: error.message }),
      ),
    );
  });
}