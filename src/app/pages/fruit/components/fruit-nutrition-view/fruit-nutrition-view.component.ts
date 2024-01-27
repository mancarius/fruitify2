import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { calculateRecommendedDailyIntakePercentage } from './helpers/calculate-recommended-daily-intake-percentage';
import { Nutritions } from '@shared/types';
import { CircleProgressComponent } from '@shared/components/circle-progress/circle-progress.component';
import { NUTRITION_COLORS } from '@shared/constants';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-fruit-nutrition-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CircleProgressComponent, MatTooltipModule],
  template: `
    <div class="flex flex-col">
    
      <h3 class="text-sm font-medium text-center capitalize m-0">{{nutrition.name}}</h3>

      <div class="relative flex justify-center items-center"
        [matTooltip]="tooltipMessage()"
      >
        <app-circle-progress [radius]="40"
          [progress]="recommendedDailyIntakePercentage()"
          [strokeWidth]="7" [color]="color"
        ></app-circle-progress>
        <p class="absolute z-[1] top-0 w-full bottom-0 flex justify-center items-center text-sm m-0">{{nutrition.value}}g</p>
      </div>

    </div>
  `,
  styleUrl: './fruit-nutrition-view.component.scss'
})
export class FruitNutritionViewComponent implements OnChanges {
  @Input({ required: true })
  nutrition!: { name: keyof Nutritions, value: number };

  protected recommendedDailyIntakePercentage = signal<number>(0);

  protected tooltipMessage = computed(() => `Fits the ${this.recommendedDailyIntakePercentage()}% of the recommended daily intake.`);

  /**
   * Gets the color associated with the nutrition name.
   * @returns The color value.
   */
  get color() {
    return NUTRITION_COLORS[this.nutrition?.name] ?? '#e0e0e0';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nutrition']) {
      const percentage = calculateRecommendedDailyIntakePercentage(this.nutrition.value, this.nutrition.name);
      this.recommendedDailyIntakePercentage.set(percentage.toPrecision(2) as unknown as number);
    } else {
      this.recommendedDailyIntakePercentage.set(0);
    }
  }
}
