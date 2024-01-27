import { Nutritions } from '@shared/types';

/**
 * Calculates the recommended daily intake percentage for a given nutrition value.
 * 
 * @param value - The value of the nutrition.
 * @param nutritionType - The type of nutrition (carbohydrates, protein, fat, calories, sugar).
 * @returns The recommended daily intake percentage.
 */
export function calculateRecommendedDailyIntakePercentage(value: number, nutritionType: keyof Nutritions): number {
  switch (nutritionType) {
    case 'carbohydrates':
      return value / 50 * 100;
    case 'protein':
      return value / 25 * 100;
    case 'fat':
      return value / 20 * 100;
    case 'calories':
      return value / 200 * 100;
    case 'sugar':
      return value / 5 * 100;
    default:
      return 0;
  }
}
