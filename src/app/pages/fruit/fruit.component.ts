import { AfterViewInit, Component, Injector, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Data } from '@angular/router';
import { PhotoStore } from '@shared/store';
import { provideComponentStore } from '@ngrx/component-store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Fruit, MediaPhoto, Nullable } from '@shared/types';
import { Observable, filter, map } from 'rxjs';
import { FruitPreviewComponent } from '@shared/components/fruit-preview/fruit-preview.component';
import { FruitDetailComponent } from './components/fruit-detail/fruit-detail.component';
import { RelatedFruitsComponent, RelatedFruitsContentDirective } from '@shared/components/related-fruits/related-fruits.component';
import { FruitListComponent } from '@shared/components/fruit-list/fruit-list.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-fruit',
  standalone: true,
  imports: [CommonModule, FruitPreviewComponent, FruitDetailComponent, RelatedFruitsComponent, RelatedFruitsContentDirective, FruitListComponent, MatCardModule],
  providers: [provideComponentStore(PhotoStore)],
  host: {
    class: 'w-full min-h-screen flex flex-col justify-center items-center relative'
  },
  template: `
    <article class="w-full dark:text-slate-200 flex flex-col gap-4">
      <header class="relative w-full h-64 sm:h-96 flex flex-col justify-end items-center bg-center bg-no-repeat bg-cover"
        [ngStyle]="{'background-image': headerBackgroundImage()}">
        <span id="blackOverlay" class="w-full h-full absolute opacity-60 bg-black z-0"></span>
        <h2
          class="text-4xl sm:text-6xl font-bold text-white z-10 pl-4 md:pl-0 pb-4 md:pb-2 dark:text-white w-full max-w-screen-sm">
          {{fruit()?.name}}
        </h2>
      </header>

      <main class="flex flex-col items-center p-4 z-1 z-10 w-full">
        <app-fruit-detail class="block w-full max-w-screen-sm flex flex-col gap-4" [fruit]="fruit()"></app-fruit-detail>
      </main>
    </article>

    @if(fruit()) {
      <aside class="w-full flex flex-col gap-4 max-w-screen-sm mx-auto">
        <h3 class="font-bold text-sm text-black dark:text-white m-0">Related fruits</h3>

        <mat-card class="w-full bg-slate-100 dark:bg-slate-50/10">
          <mat-card-content>
            @defer (on viewport) {
              <nav class="w-full">
                <app-related-fruits [fruit]="fruit()" [maxSuggestions]="4">
                  <ng-template appRelatedFruitsContent let-fruits>
                    <app-fruit-list [fruits]="fruits"></app-fruit-list>
                  </ng-template>
                </app-related-fruits>
              </nav>
            } @placeholder {
              <p class="text-slate-400 dark:text-slate-500">Loading...</p>
            }
          </mat-card-content>
        </mat-card>
      </aside>
    }
  `,
})
export class FruitComponent implements AfterViewInit {
  private _injector = inject(Injector);

  private _activatedRoute = inject(ActivatedRoute);

  private _routeData$: Observable<Data | { fruit: Nullable<Fruit>, photo: Nullable<MediaPhoto> }> = this._activatedRoute.data;

  private _fruit$: Observable<NonNullable<Fruit>> = this._routeData$.pipe(
    filter((data) => 'fruit' in data),
    map((data) => data.fruit)
  );

  private _photo$: Observable<MediaPhoto> = this._routeData$.pipe(
    filter((data) => 'photo' in data),
    map((data) => data.photo)
  );

  private _photo = toSignal(this._photo$, { initialValue: null });
  
  /* Public properties */
  fruit = toSignal(this._fruit$, { initialValue: null });

  headerBackgroundImage = computed(() => `url(${this._photo()?.url})`);

  ngAfterViewInit(): void {
    effect(() => {
      this.fruit();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, { injector: this._injector });
  }
}
