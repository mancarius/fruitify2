import { Fruit, Nullable } from '.';
import { MediaOptions } from './photo-finder.interface';

export type FruitWithOptions = { fruit: Nullable<Fruit>, options: Partial<MediaOptions> }