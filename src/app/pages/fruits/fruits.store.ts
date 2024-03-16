import { Injectable } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ComponentStore } from "@ngrx/component-store";
import { LoadingService } from "@shared/services/loading/loading.service";
import { Fruit, Nullable, SearchContext } from "@shared/types";
import { Observable, map, shareReplay, tap } from "rxjs";

export type HomeState = {
  fruits: Fruit[],
  queryParams: Nullable<Params & Record<SearchContext, Nullable<string>>>,
};

export const homeInitialState: HomeState = {
  fruits: [],
  queryParams: null,
};

@Injectable()
export class FruitsStore extends ComponentStore<HomeState>{
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    super(homeInitialState);

    this.setQueryParams(this.routeQueryParams$);
  }

  /* ========== Selectors ========== */

  readonly routeQueryParams$ = this._activatedRoute.queryParams.pipe(map((queryParams) => queryParams as Params & Record<SearchContext, Nullable<string>>));

  readonly vm = this.selectSignal(state => ({
    fruits: state.fruits
  }));

  /* ========== Updaters ========== */

  readonly setFruits = this.updater((state, fruits: Fruit[]) => {
    return { ...state, fruits };
  });

  readonly setQueryParams = this.updater((state, queryParams: Nullable<Params & Record<SearchContext, Nullable<string>>>) => {
    return { ...state, queryParams };
  });

  /* ========== Effects ========== */

  /**
   * Performs a search based on the provided query parameters and navigates to the home page with the updated query parameters.
   * @param query$ - An observable that emits the query parameters for the search.
   * @returns An observable that emits the updated query parameters after navigating to the home page.
   */
  readonly search = this.effect((query$: Observable<Record<SearchContext, Nullable<string>> | null>) => {
    return query$.pipe(
      tap((query) => {
        const queryParams = query ?? {};
        this._router.navigate(["/"], { queryParams });
      })
    );
  });

}