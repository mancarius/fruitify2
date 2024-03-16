import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { FruitsSearchComponent } from '@shared/components/fruits-search/fruits-search.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Fruit, Nullable, SearchContext } from '@shared/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideComponentStore } from '@ngrx/component-store';
import { FruitPreviewPlaceholderComponent } from '@shared/components/fruit-preview-placeholder/fruit-preview-placeholder.component';
import { FruitListComponent } from '@shared/components/fruit-list/fruit-list.component';
import { FruitPreviewComponent } from '@shared/components/fruit-preview/fruit-preview.component';
import { FruitsStore } from './fruits.store';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    FruitsSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    FruitListComponent,
    FruitPreviewComponent,
    FruitPreviewPlaceholderComponent,
    RouterLink
  ],
  providers: [
    provideComponentStore(FruitsStore),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm(); as vm) {
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
                  Found {{ vm.fruits.length }} fruit{{ vm.fruits.length > 1 ? 's' : '' }}.
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
            <polygon class="text-gray-100 dark:text-gray-800 fill-current" points="2560 0 2560 100 0 100">
            </polygon>
          </svg>
        </div>

      </div>


      <section class="pb-20 -mt-24 container mx-auto">
        <app-fruit-list class="relative mx-auto px-4 max-w-screen-lg" [fruits]="vm.fruits"></app-fruit-list>
      </section>
    }
  `,
  styles: [
    `
      .hero-bg {
        background-image: url("/assets/images/pexels-jane-doan-1128678.jpg")
      }
    `,
  ],
})
export class FruitsComponent implements OnInit {
  readonly #destroy$ = inject(DestroyRef);
  private readonly _cs = inject(FruitsStore);
  readonly searchControl = new FormControl<Record<SearchContext, Nullable<string>> | null>(null);
  @Input() set fruits(fruits: Fruit[]) { this._cs.setFruits(fruits) }
  protected readonly vm = this._cs.vm;

  ngOnInit() {
    this._cs.search(this.searchControl.valueChanges);

    this._cs.routeQueryParams$
      .pipe(takeUntilDestroyed(this.#destroy$))
      .subscribe((queryParams) => {
        this.searchControl.patchValue(queryParams);
      });
  }
}
