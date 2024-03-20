import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calculateRecommendedDailyIntakePercentage as getRecommendedDailyIntakePercentage } from './helpers/calculate-recommended-daily-intake-percentage';
import { Nutritions } from '@shared/types';
import { CircleProgressComponent } from '@shared/components/circle-progress/circle-progress.component';
import { NUTRITION_COLORS, NUTRITION_DEFAULT_COLOR } from '@shared/constants';

@Component({
  selector: 'app-fruit-nutrition-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CircleProgressComponent],
  host: { class: 'flex gap-4' },
  template: `
    <div class="relative flex justify-center items-center h-[6rem] w-[8rem]">
      <app-circle-progress
        class="w-full h-full"
        [radius]="35"
        [progress]="recommendedDailyIntakePercentage()"
        [strokeWidth]="10"
        [color]="color()">
      </app-circle-progress>
      <p class="absolute z-[1] top-0 w-full bottom-0 flex justify-center items-center text-sm m-0">{{nutrition().value}}g</p>
    </div>

    <div class="flex flex-col gap-2 grow-1">
      <h3 class="text-sm font-medium text-left capitalize m-0">{{nutrition().name}}</h3>
      <p class="m-0">Fits the
        <strong [ngClass]="{'text-red-600': recommendedDailyIntakePercentage() > 100}">{{recommendedDailyIntakePercentage()}}%</strong>
        of the recommended daily intake.
      </p>
    </div>
  `,
})
export class FruitNutritionViewComponent {
  readonly nutrition = input.required<{ name: keyof Nutritions, value: number }>();

  protected readonly recommendedDailyIntakePercentage = computed<number>(() => {
    const rdi = getRecommendedDailyIntakePercentage(this.nutrition().value, this.nutrition().name);
    return Math.round(rdi);
  });

  protected readonly color = computed<string>(() => NUTRITION_COLORS[this.nutrition()?.name] ?? NUTRITION_DEFAULT_COLOR);
}
