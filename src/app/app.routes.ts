import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'fruits'
  },
  {
    path: 'fruits',
    async loadComponent() {
      const c = await import('./pages/fruits/fruits.component');
      return c.FruitsComponent;
    },
  }
];
