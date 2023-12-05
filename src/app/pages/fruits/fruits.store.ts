import { Injectable } from '@angular/core';
import { Fruit } from "../../shared/types";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { FruitService } from '../../shared/services/fruit/fruit.service';
import { Observable, switchMap, tap } from 'rxjs';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { HttpErrorResponse } from '@angular/common/http';

export type FruitsState = {
  fruits: Fruit[];
  error: string|null;
}

export const fruitsInitialState: FruitsState = {
  fruits: [],
  error: null,
};

@Injectable()
export class FruitsStore extends ComponentStore<FruitsState> {
  private readonly _startLoading = this._loadingService.start.bind(this._loadingService);
  private readonly _stopLoading = this._loadingService.stop.bind(this._loadingService);

  constructor(private _fruitService: FruitService, private _loadingService: LoadingService) {
    super(fruitsInitialState);
  }

  /* ========== Selectors ========== */

  /**
   * Observable that emits the current state of the fruits in the store.
   */
  readonly fruits$ = this.select((state) => state.fruits);

  /**
   * Observable that emits the current error in the store.
   */
  readonly error$ = this.select((state) => state.error);

  /* ========== Effects ========== */

  /**
   * Fetches all fruits from the fruit service and updates the state with the fetched fruits.
   * @returns An observable that emits the fetched fruits.
   */
  readonly fetchFruits = this.effect((trigger$) => {
    return trigger$.pipe(
      tap(() => this._startLoading()),
      switchMap(() => this._fruitService.getAll()),
      tap(() => this._stopLoading()),
      tapResponse(
        (fruits) => this.patchState({ fruits }),
        (error: HttpErrorResponse) => this.patchState({ error: error.message }),
      ),
    );
  });

  /**
   * Retrieves fruits by name.
   * @param name - A strings representing the fruit names.
   * @returns An observable that emits the retrieved fruits.
   */
  readonly getFruitByName = this.effect((name$: Observable<string>) => {
    return name$.pipe(
      tap(() => this._startLoading()),
      switchMap((name: string) => this._fruitService.getWithQuery({ name })),
      tap(() => this._stopLoading()),
      tapResponse(
        (fruits) => this.patchState({ fruits }),
        (error: HttpErrorResponse) => this.patchState({ error: error.message }),
      ),
    );
  });
}