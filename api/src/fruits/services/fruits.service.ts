import { Injectable } from '@nestjs/common';
import { Fruit } from 'src/fruits/models/fruit.model';
import fruits from './data';

@Injectable()
export class FruitsService {
  findAll(): Fruit[] {
    return fruits;
  }

  findOne(id: number): Fruit | null {
    return fruits.find((fruit) => fruit.id === id) ?? null;
  }

  find<T extends Fruit, K extends keyof T>(query: Record<K, T[K]>): T[] {
    return (fruits as T[]).filter((fruit) => {
      return Object.keys(query).every((key) => {
        if (typeof fruit[key as K] === 'object') false;
        return String(fruit[key as K]).toLocaleLowerCase() === String(query[key as K]).toLocaleLowerCase();
      });
    });
  }
}
