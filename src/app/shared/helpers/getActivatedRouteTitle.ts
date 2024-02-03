import { ActivatedRoute } from '@angular/router';

/**
 * Retrieves the title from the ActivatedRoute snapshot data.
 * If the title is not available, it returns 'Unknown'.
 * 
 * @param route - The ActivatedRoute instance.
 * @param fallback - The fallback title to use if the title is not available.
 * @returns The title from the ActivatedRoute snapshot data or 'Unknown'.
 */
export function getActivatedRouteTitle(route: ActivatedRoute, fallback: string = 'Unknown'): string {
  while (route?.firstChild) {
    route = route.firstChild;
  }

  return route?.snapshot.title ?? fallback;
}