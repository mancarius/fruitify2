import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Fruit, MediaPhoto, Nullable } from '@shared/types';
import { FruitDetailComponent } from './components/fruit-detail/fruit-detail.component';
import { RelatedFruitsComponent, RelatedFruitsContentDirective } from '@shared/components/related-fruits/related-fruits.component';
import { FruitListComponent } from '@shared/components/fruit-list/fruit-list.component';
import { MatCardModule } from '@angular/material/card';
import { MAX_SUGGESTIONS_PREVIEW_OPTION } from '@tokens';

@Component({
  selector: 'app-fruit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FruitDetailComponent,
    RelatedFruitsComponent,
    RelatedFruitsContentDirective,
    FruitListComponent,
    MatCardModule
  ],
  host: {
    class: 'w-full min-h-screen flex flex-col justify-center items-center relative'
  },
  template: `
    <article class="w-full dark:text-slate-200 flex flex-col gap-4 grow">
      <header class="relative w-full h-64 sm:h-96 flex flex-col justify-end items-center bg-center bg-no-repeat bg-cover"
        [style.background-image]="heroBackgroundImage()">
        <span id="blackOverlay" class="w-full h-full absolute opacity-60 z-0 dark:bg-black bg-white"></span>
        <h2
          class="text-4xl sm:text-6xl font-bold text-black dark:text-white z-10 pl-4 md:pl-0 pb-4 md:pb-2 w-full max-w-screen-sm">
          {{fruit()?.name}}
        </h2>
      </header>

      <main class="flex flex-col items-center p-4 z-1 z-10 w-full">
        <app-fruit-detail class="w-full max-w-screen-sm flex flex-col gap-4" [fruit]="fruit()"></app-fruit-detail>
      </main>
    </article>

    @if(fruit()) {
      <aside class="w-full flex flex-col gap-4 p-4 pt-0" data-testid="related-fruits">
        <h3 class="font-bold text-sm text-black dark:text-white m-0 w-full max-w-screen-sm mx-auto">Related fruits</h3>

        <mat-card class="w-full bg-white dark:bg-slate-50/10 max-w-screen-sm mx-auto">
          <mat-card-content>
            @defer (on viewport) {
              <nav class="w-full">
                <app-related-fruits [fruit]="fruit()" [maxSuggestions]="maxSuggestions">
                  <ng-template appRelatedFruitsContent let-fruits>
                    <app-fruit-list [fruits]="fruits"></app-fruit-list>
                  </ng-template>
                </app-related-fruits>
              </nav>
            } @placeholder (minimum 500ms) {
              <p class="text-slate-400 dark:text-slate-500" data-testid="related-fruits-placeholder">Loading related fruits...</p>
            } @loading (after 100ms; minimum 1s) {
              <p class="text-slate-400 dark:text-slate-500" data-testid="related-fruits-loading">Loading...</p>
            }
          </mat-card-content>
        </mat-card>
      </aside>
    }
  `,
})
export class FruitComponent {
  readonly maxSuggestions = inject(MAX_SUGGESTIONS_PREVIEW_OPTION);

  readonly photo = input.required<Nullable<MediaPhoto>>();

  readonly heroBackgroundImage = computed(() => `url(${this.photo()?.url.lg})`);

  readonly fruit = input.required<Nullable<Fruit>>();

  readonly scrollOnTopEffect = effect(() => {
    this.fruit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
