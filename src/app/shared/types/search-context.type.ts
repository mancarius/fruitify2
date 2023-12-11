import { Fruit } from "./fruit.type";

/**
 * Represents the search context for filtering fruits.
 * It is a string literal type that can only have values from the keys of the Fruit type,
 * excluding the "id" and "nutritions" properties.
 */
export type SearchContext = keyof Omit<Fruit, "id" | "nutritions">;