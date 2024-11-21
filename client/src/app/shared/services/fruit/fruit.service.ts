import { Injectable, inject, signal } from "@angular/core";
import { Fruit, QueryParams } from "@shared/types";
import { HttpClient } from "@angular/common/http";
import {
  Observable,
  forkJoin,
  map,
  take,
  tap,
  iif
} from "rxjs";
import { API_BASE_PATHNAME } from "@shared/constants";
import { toObservable } from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: "root",
})
export class FruitService {
  readonly #baseUrl = inject(API_BASE_PATHNAME);
  readonly #entities = signal<Fruit[]>([]);
  readonly #http = inject(HttpClient);
  readonly #loaded = signal(false);

  readonly loaded = this.#loaded.asReadonly();

  readonly entities = this.#entities.asReadonly();

  readonly #entities$ = toObservable(this.#entities);

  /**
   * Retrieves all fruits.
   * @returns An Observable that emits an array of Fruit objects.
   */
  getAll(): Observable<Fruit[]> {
    const fetch = () => {
      const url = this._composeUrl("all");
      return this.#http.get<Fruit[]>(url).pipe(
        tap((entities) => {
          this.setLoaded(true);
          this.#entities.set(entities);
        })
      );
    }

    return iif(
      () => this.#loaded(),
      this.#entities$.pipe(take(1)),
      fetch()
    );
  }

  /**
   * Retrieves a fruit by its ID.
   * @param id - The ID of the fruit to retrieve.
   * @returns An Observable that emits the fruit with the specified ID.
   */
  getById(id: number): Observable<Fruit> {
    const url = `${this._composeUrl()}/${id}`;
    return this.#http
      .get<Fruit>(url)
      .pipe(tap((entity) => this._patchEntities([entity])));
  }

  /**
   * Retrieves an array of fruits based on the provided query parameters.
   * @param query - The query parameters to filter the fruits.
   * @returns An observable that emits an array of fruits.
   */
  getWithQuery(
    query: QueryParams<keyof Omit<Fruit, "nutritions" | "id">>,
  ): Observable<Fruit[]> {
    const entries = Object.entries(query);
    const urls = entries.map(([key, value]) => `${this._composeUrl(key)}/${value}`);
    const httpRequests = urls.map((url) => this.#http.get<Fruit[]>(url));

    return forkJoin(httpRequests).pipe(
      map((results) => results.flat()),
      tap((entities) => this._patchEntities(entities)),
      map(function (fruits) {
        return fruits.sort((a, b) => a.name.localeCompare(b.name));
      }),
    );
  }

  /**
   * Sets the loaded state of the fruit service.
   * @param loaded - The loaded state to set.
   */
  setLoaded(loaded: boolean): void {
    this.#loaded.set(loaded);
  }

  /**
   * Composes the URL based on the provided key.
   * If the key is included in the keyList, it appends the key to the base URL.
   * Otherwise, it returns the base URL.
   *
   * @param key - The key to be appended to the URL.
   * @returns The composed URL.
   */
  _composeUrl(key = ""): string {
    const url = `${this.#baseUrl}/fruits`;
    const keyList = ["all", "family", "genus", "order"];

    return keyList.includes(key) ? `${url}/${key}` : url;
  }

  /**
   * Updates the existing entities with the provided entities or adds them if they don't exist.
   * @param entities - The entities to be patched.
   */
  _patchEntities(entities: Fruit[]): void {
    const currentEntities = this.#entities();

    for (let entity of entities) {
      const index = this.#entities().findIndex((e) => e.id === entity.id);

      if (index > -1) {
        currentEntities[index] = entity;
      } else {
        currentEntities.push(entity);
      }
    }

    this.#entities.set(currentEntities);
  }
}
