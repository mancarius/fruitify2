import { ResolveFn } from '@angular/router';

/**
 * Resolves the title for the fruit route.
 * 
 * @param route - The current route.
 * @param state - The current state.
 * @returns The resolved title for the fruit route.
 */
export const fruitRouteTitleResolver: ResolveFn<string> = (route, state) => {
  const fruitName: string = route?.params?.['fruitName'];
  const fruitNameTitleCase = fruitName?.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
  const fruitNameTitleCaseWithEmoji = `${fruitNameTitleCase} - Fruitify`;
  const title = fruitNameTitleCase ? fruitNameTitleCaseWithEmoji : 'Frutify';

  return title;
};
