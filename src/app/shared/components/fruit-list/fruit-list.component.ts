import { ChangeDetectionStrategy, Component, Input, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fruit } from '@shared/types';
import { FruitPreviewComponent } from '../fruit-preview/fruit-preview.component';
import { FruitPreviewPlaceholderComponent } from '@shared/components/fruit-preview-placeholder/fruit-preview-placeholder.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { EncodeToPathSegmentPipe } from '@pipes';

@Component({
  selector: 'app-fruit-list',
  standalone: true,
  imports: [CommonModule, FruitPreviewComponent, FruitPreviewPlaceholderComponent, RouterLink, RouterLinkActive, EncodeToPathSegmentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,

  host: {
    class: 'block',
  },

  template: `
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

      @for (fruit of fruits(); track fruit.id) {

        <li class="aspect-[3/2] flex flex-col">

          @defer (on viewport) {

            <a class="grow flex"
              [routerLink]="['/fruit', fruit.name | encodeToPathSegment]"
              [queryParams]="{ fruitId: fruit.id }"
              routerLinkActive="active"
            >
              <app-fruit-preview class="grow flex justify-center items-center" [fruit]="fruit"></app-fruit-preview>
            </a>

          } @loading (after 100ms; minimum 1s) {

            <app-fruit-preview-placeholder class="grow"></app-fruit-preview-placeholder>

          } @placeholder (minimum 500ms) {

            <app-fruit-preview-placeholder class="grow"></app-fruit-preview-placeholder>
            
          }

        </li>

      } @empty {

        <li class="col-span-full">
          <p class="text-center bg-white/80 dark:bg-gray-900/80 w-fit px-2 m-0 mx-auto">No fruits found</p>
        </li>

      }

    </ul>
  `
})
export class FruitListComponent {
  fruits = input.required<Fruit[]>();
}
