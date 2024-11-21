import { Routes } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { MinimalHorizontalLayoutComponent } from '@core/layouts';

export default [
  // Fruits
  {
    path: 'fruits',
    pathMatch: 'prefix',
    providers: [FruitService],
    component: MinimalHorizontalLayoutComponent,
    loadChildren: async () => import('@pages/fruits/fruits.routes')
  },

  // Fruit
  {
    path: 'fruit',
    runGuardsAndResolvers: 'always',
    component: MinimalHorizontalLayoutComponent,
    loadChildren: async () => import('@pages/fruit/fruit.routes'),
  },

  // Settings
  {
    path: 'settings',
    loadComponent: async () => {
      const c = await import('@core/layouts');
      return c.SettingsLayoutComponent
    },
    loadChildren: async () => import('@pages/settings/settings.routes'),
  },

  // Not Found
  {
    path: 'not-found',
    pathMatch: 'full',
    component: MinimalHorizontalLayoutComponent,
    children: [
      {
        title: 'Not Found',
        path: '',
        pathMatch: 'full',
        loadComponent: async () => {
          const c = await import('@pages/not-found/not-found.component');
          return c.NotFoundComponent;
        },
      },
    ],
  },

  // Application Error
  {
    path: 'error',
    pathMatch: 'full',
    component: MinimalHorizontalLayoutComponent,
    children: [
      {
        title: 'Error',
        path: '',
        pathMatch: 'full',
        loadComponent: async () => {
          const c = await import('@pages/error/error.component');
          return c.ErrorComponent;
        },
      }
    ],
  },

  // Redirect to `fruits` if no route matches
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'fruits',
  },

  // Redirect to `not-found` if no route matches
  {
    path: '**',
    title: '404',
    redirectTo: 'not-found',
  }
] satisfies Routes;
