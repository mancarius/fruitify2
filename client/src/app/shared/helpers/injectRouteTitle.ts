import { assertInInjectionContext, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map, switchMap } from 'rxjs';

/**
 * Gets the title of the active child route.
 * @param route The route to get the title of.
 * @returns A signal that emits the title of the active child route.
 */
function getActiveTitleChild(route: ActivatedRoute): Observable<string | undefined> {
  while (route.firstChild) {
    route = route.firstChild;
  }

  return route.title
}

/**
 * Injects the title of the current route into the application.
 * If the title is not available, a fallback value is used.
 * @param fallback The fallback value to use when the title is not available. Default is 'Unknown'.
 * @returns A signal that emits the title of the current route.
 */
export function injectRouteTitle(fallback = 'Unknown') {
  assertInInjectionContext(injectRouteTitle);
  const activatedRoute = inject(ActivatedRoute);
  const router = inject(Router);

  return toSignal(
    router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      switchMap(() =>
        getActiveTitleChild(activatedRoute).pipe(
          map((title) => title ?? fallback)
        )
      )
    ),
    { initialValue: '' }
  );
}