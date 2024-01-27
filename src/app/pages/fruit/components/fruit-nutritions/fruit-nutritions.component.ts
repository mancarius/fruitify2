import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nutritions } from '@shared/types';
import { FruitNutritionViewComponent } from '../fruit-nutrition-view/fruit-nutrition-view.component';


/**
 * Transforms the given Nutritions object into an array of objects with name-value pairs.
 * @param value The Nutritions object to transform.
 * @returns An array of objects with name-value pairs.
 */
function transformNutritions(value: Nutritions): Array<{ name: keyof Nutritions, value: number }> {
  return Object.entries(value).reduce((acc: any[], [name, value]) => [...acc, { name, value }], []);
}


@Component({
  selector: 'app-fruit-nutritions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FruitNutritionViewComponent],
  host: { class: 'w-full flex flex-col bg-cover bg-center flex flex-col relative justify-center items-center' },
  template: `
    <ul class="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
    @for(nutrition of nutritionEntries; track trackByNutrition){
      <li>
        <app-fruit-nutrition-view [nutrition]="nutrition"></app-fruit-nutrition-view>
      </li>
    }
    </ul>
  `
})
export class FruitNutritionsComponent {
  @Input({ alias: 'nutritions', required: true, transform: transformNutritions })
  nutritionEntries!: Array<{ name: keyof Nutritions, value: number }>;

  trackByNutrition(index: number, item: { name: keyof Nutritions, value: number }) {
    return item.name;
  }
}
