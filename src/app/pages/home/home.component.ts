import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, Signal, inject } from '@angular/core';
import { FruitsSearchComponent } from '@shared/components/fruits-search/fruits-search.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Fruit, Nullable, SearchContext } from '@shared/types';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LoadingService } from '@shared/services/loading/loading.service';
import { provideComponentStore } from '@ngrx/component-store';
import { FruitPreviewPlaceholderComponent } from '@shared/components/fruit-preview-placeholder/fruit-preview-placeholder.component';
import { FruitListComponent } from '@shared/components/fruit-list/fruit-list.component';
import { FruitPreviewComponent } from '@shared/components/fruit-preview/fruit-preview.component';
import { HomeStore } from './home.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FruitsSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    FruitListComponent,
    FruitPreviewComponent,
    FruitPreviewPlaceholderComponent,
    RouterLink
  ],
  providers: [
    provideComponentStore(HomeStore),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[30rem] lg:min-h-[50vh]">

      <div class="hero-bg absolute top-0 w-full h-full bg-center bg-cover bg-fixed">

        <span id="blackOverlay" class="w-full h-full absolute opacity-75 dark:bg-black bg-white"></span>

      </div>

      <div class="container relative mx-auto">
        <div class="items-center flex flex-wrap">
          <div class="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center flex flex-col items-center">

            <h2 class="text-black dark:text-white font-semibold text-4xl sm:text-5xl">
              Your wellness starts from here.
            </h2>

            <app-fruits-search
              class="block w-full dark:text-white text-black max-w-xl backdrop-blur-md"
              [formControl]="searchControl">
            </app-fruits-search>

            <div class="w-full mt-4 text-sm flex justify-between max-w-xl">

              <p class="dark:text-gray-300 text-gray-700">
                Found {{ fruits().length }} fruit{{ fruits().length > 1 ? 's' : '' }}.
              </p>

              <a routerLink="/fruits" class="ml-4 hover:underline">
                Show all
              </a>

            </div>

          </div>
        </div>
      </div>

      <div class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-[70px]">

        <svg class="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
          version="1.1" viewBox="0 0 2560 100" x="0" y="0">
          <polygon class="text-gray-200 dark:text-gray-800 fill-current" points="2560 0 2560 100 0 100">
          </polygon>
        </svg>
      </div>

    </div>


    <section class="pb-20 -mt-24 container mx-auto">
      <app-fruit-list class="relative mx-auto px-4 max-w-screen-lg" [fruits]="fruits()"></app-fruit-list>
    </section>
  `,
  styles: [
    `
      .hero-bg {
        background-image: url("/assets/images/pexels-jane-doan-1128678.jpg")
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  readonly #cs = inject(HomeStore);
  readonly #loadingService = inject(LoadingService);
  readonly #destroy$ = inject(DestroyRef);
  readonly searchControl = new FormControl<Record<SearchContext, Nullable<string>> | null>(null);
  readonly #queryParams$ = this.searchControl.valueChanges;
  readonly fruits: Signal<Fruit[]> = toSignal(this.#cs.fruits$, { initialValue: [] });
  readonly loading: Signal<boolean> = toSignal(this.#loadingService.loading$, { initialValue: false });

  ngOnInit() {
    this.#cs.search(this.#queryParams$);

    this.#cs.queryParams$
      .pipe(takeUntilDestroyed(this.#destroy$))
      .subscribe((queryParams) => {
        this.searchControl.patchValue(queryParams);
      });
  }
}
