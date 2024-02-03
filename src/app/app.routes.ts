import { Routes } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { fruitResolver, fruitsResolver, photoResolver, fruitRouteTitleResolver } from '@resolvers';
import { HomeComponent } from '@pages/home/home.component';
import { MinimalHorizontalLayoutComponent } from '@core/layouts';

export default [
  // Fruits
  {
    path: 'fruits',
    pathMatch: 'prefix',
    providers: [FruitService],
    component: MinimalHorizontalLayoutComponent,
    children: [

      // Load `FruitsComponent` when the user navigates to `/fruits`
      {
        path: '',
        title: 'Frutify',
        pathMatch: 'full',
        runGuardsAndResolvers: 'always',
        resolve: { fruits: fruitsResolver },
        component: HomeComponent,
      },

    ]
  },

  // Fruit
  {
    path: 'fruit',
    pathMatch: 'prefix',
    runGuardsAndResolvers: 'always',
    component: MinimalHorizontalLayoutComponent,
    children: [
      // Lazy load `FruitComponent` when the user navigates to `/fruit/:fruitName`
      {
        title: fruitRouteTitleResolver,
        path: ':fruitName',
        pathMatch: 'full',
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
        resolve: {
          fruit: fruitResolver,
          photo: photoResolver
        },
        loadComponent: async () => {
          const c = await import('@pages/fruit/fruit.component');
          return c.FruitComponent;
        },
      }

    ]
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

  // Redirect to `fruits` if no route matches
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'fruits',
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

  // Redirect to `not-found` if no route matches
  {
    path: '**',
    title: '404',
    redirectTo: 'not-found',
  }
] satisfies Routes;
