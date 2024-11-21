import { fruitRouteTitleResolver, fruitResolver, photoResolver } from './resolvers';
import { FruitComponent } from './fruit.component';
import { Routes } from '@angular/router';
import { MAX_SUGGESTIONS_PREVIEW_OPTION } from '@tokens';

export default [
  {
    path: ':fruitName',
    pathMatch: 'full',
    runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
    title: fruitRouteTitleResolver,
    providers: [
      { provide: MAX_SUGGESTIONS_PREVIEW_OPTION, useValue: 4 }
    ],
    resolve: {
      fruit: fruitResolver,
      photo: photoResolver
    },
    component: FruitComponent,
  },
] satisfies Routes;
