import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nutritions } from '@shared/types';
import { FruitNutritionViewComponent } from '../fruit-nutrition-view/fruit-nutrition-view.component';

type NutritionsArray<T extends Nutritions> = Array<{ name: keyof T, value: T[keyof T] }>;

/**
 * Component for displaying the nutritions of a fruit.
 * @example
 * <app-fruit-nutritions
 *   [nutritions]="[
 *    { name: 'calories', value: 50 },
 *    { name: 'carbs', value: 10 },
 *    { name: 'fat', value: 5 },
 *    { name: 'protein', value: 2 }
 *   ]">
 * </app-fruit-nutritions>
 */
@Component({
  selector: 'app-fruit-nutritions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FruitNutritionViewComponent],
  host: { class: 'w-full flex flex-col bg-cover bg-center flex flex-col relative justify-center items-center' },
  template: `
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
    @for(nutrition of nutritions(); track trackByNutritionName){
      <li class="rounded bg-gray-500/5 p-4">
        <app-fruit-nutrition-view [nutrition]="nutrition"></app-fruit-nutrition-view>
      </li>
    }
    @empty {
      <li>
        <p>No nutritions available</p>
      </li>
    }
    </ul>
  `
})
export class FruitNutritionsComponent<T extends Nutritions = Nutritions> {
  readonly nutritions = input.required<NutritionsArray<T>, T>({ transform: transformNutritions });

  trackByNutritionName(index: number, item: { name: keyof T, value: T[keyof T] }) {
    return item.name;
  }
}



/**
 * Transforms the given Nutritions object into an array of objects with name-value pairs.
 * @param value The Nutritions object to transform.
 * @returns An array of objects with name-value pairs.
 */
function transformNutritions<T extends Nutritions>(value: T): Array<{ name: keyof T, value: T[keyof T] }> {
  return Object.entries(value).reduce((acc: ReturnType<typeof transformNutritions>, [name, value]) => [...acc, { name, value }], []);
}
