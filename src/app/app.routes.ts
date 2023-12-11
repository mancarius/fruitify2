import { Routes } from '@angular/router';
import { FruitService } from '@shared/services/fruit/fruit.service';
import { fruitResolver, fruitsResolver } from '@resolvers';
import { HomeComponent } from '@pages/home/home.component';

export const routes: Routes = [
  {
    title: 'Frutify',
    path: 'fruits',
    pathMatch: 'prefix',
    providers: [FruitService],
    children: [
    
      {
        title: 'Frutify',
        path: '',
        pathMatch: 'full',
        runGuardsAndResolvers: 'always',
        resolve: {
          fruits: fruitsResolver
        },
        component: HomeComponent,
      },

    
      {
        title: 'Fruit',
        path: ':fruitName',
        pathMatch: 'full',
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
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
    title: 'Frutify',
    path: '',
    pathMatch: 'full',
    redirectTo: 'fruits',
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
