import { Routes } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { fruitResolver, fruitsResolver } from '@resolvers';
import { HomeComponent } from '@pages/home/home.component';

export const routes: Routes = [
  {
    title: 'Frutify',
    path: '',
    providers: [FruitService],
    pathMatch: 'full',
    runGuardsAndResolvers: 'always',
    resolve: {
      fruits: fruitsResolver
    },
    component: HomeComponent,
    children: [
      {
        title: 'Fruit',
        path: 'fruit/:id/*',
        pathMatch: 'full',
        runGuardsAndResolvers: 'pathParamsChange',
        resolve: {
          fruit: fruitResolver
        },
        loadComponent: async () => {
          const c = await import('./pages/fruit/fruit.component');
          return c.FruitComponent;
        },
      }
    ]
  },
  {
    title: '404',
    path: '**',
    loadComponent: async () => {
      const c = await import('./pages/not-found/not-found.component');
      return c.NotFoundComponent;
    },
  }
];
