import { Routes } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { fruitResolver, fruitsResolver } from '@resolvers';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'fruits'
  },
  {
    path: 'fruits',
    providers: [FruitService],
    children: [
      {
        title: 'Fruits',
        path: '',
        pathMatch: 'full',
        resolve: {
          fruits: fruitsResolver
        },
        loadChildren: async () => {
          const c = await import('./pages/fruits/fruits.component');
          return c.FruitsComponent;
        },
      },
      {
        title: 'Fruit',
        path: '/:id/*',
        pathMatch: 'full',
        resolve: {
          fruit: fruitResolver
        },
        loadChildren: async () => {
          const c = await import('./pages/fruit/fruit.component');
          return c.FruitComponent;
        },
      }
    ]
  }
];
