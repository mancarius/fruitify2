import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

/**
 * Determines whether the user can activate the fruit guard.
 * 
 * @param route - The activated route snapshot.
 * @param state - The router state snapshot.
 * @returns A boolean indicating whether the user can activate the fruit guard or an url tree if the user can't activate the fruit guard.
 */
export const canActivateFruit: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const { fruit = null } = route.data || {};

  return fruit !== null ? true : router.parseUrl('not-found')
};