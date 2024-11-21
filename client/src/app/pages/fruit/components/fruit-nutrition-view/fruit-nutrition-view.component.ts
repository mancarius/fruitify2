import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { calculateRecommendedDailyIntakePercentage as getRecommendedDailyIntakePercentage } from "./helpers/calculate-recommended-daily-intake-percentage";
import { Nutritions } from "@shared/types";
import { CircleProgressComponent } from "@shared/components/circle-progress/circle-progress.component";
import {
  NUTRITION_COLORS,
  NUTRITION_DEFAULT_COLOR as DEFAULT_NUTRITION_COLOR,
} from "@shared/constants";

@Component({
  selector: "app-fruit-nutrition-view",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CircleProgressComponent],
  host: { class: "flex gap-4" },
  template: `
    @let rdiPercentage = recommendedDailyIntakePercentage();
    @let name = nutrition().name;
    @let value = nutrition().value;

    <div class="relative flex justify-center items-center h-[6rem] w-[8rem]">
      <app-circle-progress
        class="w-full h-full"
        [radius]="35"
        [progress]="rdiPercentage"
        [strokeWidth]="10"
        [color]="color()"
      >
      </app-circle-progress>
      <p
        class="absolute z-[1] top-0 w-full bottom-0 flex justify-center items-center text-sm m-0 dark:text-gray-200"
      >
        {{ value }}g
      </p>
    </div>

    <div class="flex flex-col gap-2 grow-1">
      <h3 class="text-sm font-medium text-left capitalize m-0">
        {{ name }}
      </h3>
      <p class="m-0 dark:text-gray-200">
        Fits the
        <strong
          [class.text-red-600]="rdiPercentage > 100"
          data-testid="recommended-daily-intake-percentage"
          >{{ rdiPercentage }}%</strong
        >
        of the recommended daily intake.
      </p>
    </div>
  `,
})
export class FruitNutritionViewComponent<T extends Nutritions = Nutritions> {
  readonly #nutritionColors = inject(NUTRITION_COLORS);

  readonly #defaultNutritionColor = inject(DEFAULT_NUTRITION_COLOR);

  readonly nutrition = input.required<{
    name: keyof T;
    value: T[keyof T];
  }>();

  protected readonly recommendedDailyIntakePercentage = computed<number>(() => {
    const rdi = getRecommendedDailyIntakePercentage(
      this.nutrition().value,
      this.nutrition().name,
    );
    return Math.round(rdi);
  });

  protected readonly color = computed<string>(
    () => {
      const key = this.nutrition()?.name as keyof Nutritions;
      return this.#nutritionColors[key] ??
        this.#defaultNutritionColor;
    }
  );
}
