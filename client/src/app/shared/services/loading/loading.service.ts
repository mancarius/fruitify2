import { computed, Injectable, signal } from '@angular/core';

/**
 * Service to manage the loading state of the application.
 *
 * This service keeps track of the number of active loading operations and provides
 * a signal to indicate whether there are any ongoing loading processes.
 *
 * @remarks
 * The service uses a private signal `_loadingCount` to maintain the count of active
 * loading operations. The `loading$` signal emits `true` when there is at least one
 * active loading operation and `false` otherwise.
 *
 * @example
 * ```typescript
 * constructor(private loadingService: LoadingService) {}
 *
 * someMethod() {
 *   this.loadingService.start();
 *   // Perform some async operation
 *   this.loadingService.stop();
 * }
 * ```
 *
 * @public
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /**
   * The count of active loading operations.
   */
  private readonly _loadingCount = signal(0);

  /**
   * A signal that emits `true` when there is at least one active loading operation
   * and `false` otherwise.
   */
  readonly loading = computed(() => this._loadingCount() > 0);

  /**
   * Increases the loading count by 1, indicating that a loading operation has started.
   */
  start(): void {
    this._loadingCount.update((count) => count + 1);
  }

  /**
   * Stops the loading process by decrementing the loading count.
   */
  stop(): void {
    this._loadingCount.update((count) => Math.max(0, count - 1));
  }
}
