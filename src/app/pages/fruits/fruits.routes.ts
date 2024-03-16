import { Routes } from "@angular/router";
import { FruitsComponent } from './fruits.component';
import { fruitsResolver } from "./resolvers";

export default [
  {
    path: '',
    title: 'Frutify',
    pathMatch: 'full',
    runGuardsAndResolvers: 'always',
    resolve: { fruits: fruitsResolver },
    component: FruitsComponent,
  },
] satisfies Routes;