import { Injectable } from '@angular/core';
import { BehaviorSubject, map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /**
   * The count of active loading operations.
   */
  readonly #loadingCount = new BehaviorSubject<number>(0);

  /**
   * Observable that emits a boolean value indicating whether the loading state is active or not.
   * Use this property to subscribe to loading state changes.
   */
  readonly loading$ = this.#loadingCount.pipe(map(loadingCount => loadingCount > 0), shareReplay(1));

  /**
   * Increases the loading count by 1, indicating that a loading operation has started.
   */
  start(): void {
    this.#loadingCount.next(this.#loadingCount.value + 1);
  }

  /**
   * Stops the loading process by decrementing the loading count.
   */
  stop(): void {
    this.#loadingCount.next(this.#loadingCount.value - 1);
  }
}
