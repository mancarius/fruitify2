import { Nutritions } from '@shared/types';

/**
 * Calculates the recommended daily intake percentage for a given nutrition value.
 *
 * @param value - The value of the nutrition.
 * @param nutritionType - The type of nutrition (carbohydrates, protein, fat, calories, sugar).
 * @returns The recommended daily intake percentage.
 */
export function calculateRecommendedDailyIntakePercentage<T extends Nutritions>(value: T[keyof T], nutritionType: keyof T): number {
  switch (nutritionType) {
    case 'carbohydrates':
      return Number(value) / 50 * 100;
    case 'protein':
      return Number(value) / 25 * 100;
    case 'fat':
      return Number(value) / 20 * 100;
    case 'calories':
      return Number(value) / 200 * 100;
    case 'sugar':
      return Number(value) / 5 * 100;
    default:
      return 0;
  }
}
