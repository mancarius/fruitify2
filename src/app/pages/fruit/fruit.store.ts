import { Injectable, effect, signal } from "@angular/core"
import { ComponentStore, tapResponse } from "@ngrx/component-store"
import { MediaService } from "@shared/services/media/media.service";
import { Fruit, MediaPhoto, Nullable } from "@shared/types"
import { Observable, of, switchMap, tap } from "rxjs";

@Injectable()
export class FruitStore extends ComponentStore<object> {
  constructor(private _mediaService: MediaService) {
    super();

    effect(() => this.fetchPhoto(this.fruit()));
  }

  readonly fruit = signal<Nullable<Fruit>>(null);
  readonly photo = signal<Nullable<MediaPhoto>>(null);
  readonly loading = signal<boolean>(false);

  readonly setFruit = (fruit?: Nullable<Fruit>) => this.fruit.set(fruit ?? null);

  readonly fetchPhoto = this.effect((fruit$: Observable<Nullable<Fruit>>) => {
    return fruit$.pipe(
      tap(() => this.loading.set(true)),
      switchMap((fruit) => fruit ? this._mediaService.findPhoto(fruit.name) : of(null)),
      tapResponse(
        this.photo.set,
        (error) => console.error(error),
        () => this.loading.set(false),
      ),
    );
  });
}