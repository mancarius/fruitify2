import { Nutritions } from './nutritions.model';

export type Fruit = {
  genus: string;
  name: string;
  id: number;
  family: string;
  order: string;
  nutritions: Nutritions;
};
