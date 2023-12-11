import { Injectable } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ComponentStore } from "@ngrx/component-store";
import { LoadingService } from "@shared/services/loading/loading.service";
import { Nullable, SearchContext } from "@shared/types";
import { Observable, map, shareReplay, tap } from "rxjs";

export type HomeState = {};

export const homeInitialState: HomeState = {};

@Injectable()
export class HomeStore extends ComponentStore<HomeState>{
  constructor(
    private _loadingService: LoadingService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    super(homeInitialState);
  }

  /* ========== Selectors ========== */

  readonly fruits$ = this._activatedRoute.data.pipe(map((data) => data['fruits']), shareReplay(1));
  readonly queryParams$ = this._activatedRoute.queryParams.pipe(map((queryParams) => queryParams as Params & Record<SearchContext, Nullable<string>>));

  /* ========== Updaters ========== */

  readonly setQueryParams = this.updater((state, queryParams: Nullable<Params & Record<SearchContext, Nullable<string>>>) => {
    return {
      ...state,
      queryParams,
    };
  });

  /* ========== Effects ========== */

  readonly setLoading = this.effect((loading$: Observable<boolean>) => {
    return loading$.pipe(
      tap((loading) => {
        if (loading) this._loadingService.start();
        else this._loadingService.stop();
      }),
    );
  });

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