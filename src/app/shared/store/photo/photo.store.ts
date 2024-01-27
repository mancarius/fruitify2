import { Injectable, signal } from "@angular/core"
import { ComponentStore, tapResponse } from "@ngrx/component-store"
import { MediaService } from "@shared/services/media/media.service";
import { Fruit, FruitWithOptions, MediaOptions, MediaOrientation, MediaPhoto, MediaSize, Nullable } from "@shared/types"
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

  readonly fetchPhoto = this.effect((fruitAndOptions$: Observable<FruitWithOptions>) => {
    return fruitAndOptions$.pipe(
      tap(() => this.loading.set(true)),
      switchMap(({ fruit, options = {}}) => this._findPhoto(fruit, options)
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
  private _findPhoto(fruit: Nullable<Fruit>, options?: Partial<MediaOptions>): Observable<Nullable<MediaPhoto>> {
    
    return fruit ? this._mediaService.findPhoto(fruit.name, {
      limit: 1,
      orientation: MediaOrientation.LANDSCAPE,
      size: MediaSize.SMALL,
      ...options,
    }) : of(null);
  }
}