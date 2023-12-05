import { Routes } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { fruitResolver } from '@resolvers/fruit/fruit.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'fruits'
  },
  {
    path: 'fruits',
    providers: [FruitService],
    resolve: {
      fruits: fruitResolver
    },
    children: [
      {
        title: 'Fruits',
        path: '',
        loadChildren: async () => {
          const c = await import('./pages/fruits/fruits.component');
          return c.FruitsComponent;
        },
      },
      {
        title: 'Fruit',
        path: '/:id/*',
        loadChildren: async () => {
          const c = await import('./pages/fruit/fruit.component');
          return c.FruitComponent;
        },
      }
    ]
  }
];
