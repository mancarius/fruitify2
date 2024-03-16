import { fruitRouteTitleResolver, fruitResolver, photoResolver } from './resolvers';
import { FruitComponent } from './fruit.component';
import { Routes } from '@angular/router';

export default [
  {
    path: ':fruitName',
    pathMatch: 'full',
    runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    title: fruitRouteTitleResolver,
    resolve: {
      fruit: fruitResolver,
      photo: photoResolver
    },
    component: FruitComponent,
  },
] satisfies Routes;