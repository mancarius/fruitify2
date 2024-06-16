import { Nutritions } from "./nutritions.type"

export type Fruit = {
  genus: string,
  name: string,
  id: number,
  family: string,
  order: string,
  nutritions: Nutritions
}
