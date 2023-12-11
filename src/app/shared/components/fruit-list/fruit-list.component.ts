import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fruit } from '@shared/types';
import { FruitPreviewComponent } from '../fruit-preview/fruit-preview.component';
import { FruitPreviewPlaceholderComponent } from '@shared/components/fruit-preview-placeholder/fruit-preview-placeholder.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-fruit-list',
  standalone: true,
  imports: [CommonModule, FruitPreviewComponent, FruitPreviewPlaceholderComponent, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      @for (fruit of fruits(); track fruit.id) {
        <li class="flex flex-col">
          @defer (on viewport) {
            <a class="aspect-[3/2] flex"
              [routerLink]="['/fruits', fruit.name.toLocaleLowerCase()]"
              [queryParams]="{ fruitId: fruit.id }"
              routerLinkActive="active"
            >
              <app-fruit-preview class="grow flex justify-center items-center" [fruit]="fruit"></app-fruit-preview>
            </a>
          } @placeholder {
            <app-fruit-preview-placeholder></app-fruit-preview-placeholder>
          }
        </li>
      } @empty {
        <li class="col-span-full">
          <p class="text-center bg-white/80 w-fit px-2 mx-auto">No fruits found</p>
        </li>
      }
    </ul>
  `,

  styles: [`:host { display: block; }`]

})
export class FruitListComponent {
  @Input({ alias: `fruits`, required: true })
  set _fruits(value: Fruit[]) { this.fruits.set(value) }

  fruits = signal<Fruit[]>([]);
}