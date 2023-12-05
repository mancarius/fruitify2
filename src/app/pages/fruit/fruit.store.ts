import { Injectable } from "@angular/core"
import { ComponentStore, OnStateInit, tapResponse } from "@ngrx/component-store"
import { MediaService } from "@shared/services/media/media.service";
import { Fruit, MediaPhoto } from "@shared/types"
import { Observable, of, switchMap, tap } from "rxjs";

export type fruitState = {
  fruit: Fruit|null;
  photo: MediaPhoto | null;
  loading: boolean;
}

export const fruitDefaultState: fruitState = {
  fruit: null,
  photo: null,
  loading: false,
}


@Injectable()
export class FruitStore extends ComponentStore<fruitState> implements OnStateInit {
  constructor(private _mediaService: MediaService) {
    super(fruitDefaultState)
  }

  ngrxOnStateInit() {
    this.fetchPhoto(this.fruit$);
  }

  readonly fruit$ = this.select(state => state.fruit);
  readonly photo$ = this.select(state => state.photo);
  readonly loading$ = this.select(state => state.loading);
  readonly vm$ = this.select(this.fruit$, this.photo$, this.loading$, (fruit, photo, loading) => ({ fruit, photo, loading }));

  readonly setFruit = this.updater((state, fruit: Fruit) => ({ ...state, fruit }));
  readonly setPhoto = this.updater((state, photo: MediaPhoto|null) => ({ ...state, photo }));
  readonly setLoading = this.updater((state, loading: boolean) => ({ ...state, loading }));

  readonly fetchPhoto = this.effect((fruit$: Observable<Fruit|null>) => {
    return fruit$.pipe(
      tap(() => this.setLoading(true)),
      switchMap((fruit) => fruit ? this._mediaService.findPhoto(fruit.name) : of(null)),
      tapResponse(
        this.setPhoto,
        (error) => console.error(error),
        () => this.setLoading(false),
      ),
    );
  });
}