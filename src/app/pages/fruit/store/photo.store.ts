import { Injectable, signal } from "@angular/core"
import { ComponentStore, tapResponse } from "@ngrx/component-store"
import { MediaService } from "@shared/services/media/media.service";
import { Fruit, MediaPhoto, Nullable } from "@shared/types"
import { Observable, of, switchMap, tap } from "rxjs";

@Injectable()
export class PhotoStore extends ComponentStore<object> {
  constructor(private _mediaService: MediaService) {
    super();
  }

  /* ===== State ===== */

  readonly photo = signal<Nullable<MediaPhoto>>(null);
  readonly loading = signal<boolean>(false);


  /* ===== Effects ===== */

  readonly fetchPhoto = this.effect((fruit$: Observable<Nullable<Fruit>>) => {
    return fruit$.pipe(
      tap(() => this.loading.set(true)),
      switchMap((fruit) => this._findPhoto(fruit)
        .pipe(
          tapResponse(
            this.photo.set,
            (error) => console.error(error),
            () => this.loading.set(false),
          ),
        )
      ),
    );
  });


  /* ===== Private Methods ===== */

  /**
   * Finds the photo for a given fruit.
   * @param fruit - The fruit to find the photo for.
   * @returns An observable that emits the photo if found, or null if not found.
   */
  private _findPhoto(fruit: Nullable<Fruit>): Observable<Nullable<MediaPhoto>> {
    return fruit ? this._mediaService.findPhoto(fruit.name) : of(null);
  }
}