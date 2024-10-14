import { Injectable, Injector, computed, inject, signal } from "@angular/core";
import { Fruit, QueryParams } from "@shared/types";
import { HttpClient } from "@angular/common/http";
import {
  Observable,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
  take,
  tap,
} from "rxjs";
import { API_BASE_PATHNAME } from "@shared/constants";
import { toObservable } from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: "root",
})
export class FruitService {
  private readonly _baseUrl = inject(API_BASE_PATHNAME);
  private readonly _entities = signal<Fruit[]>([]);
  private readonly _http = inject(HttpClient);
  private readonly _injector = inject(Injector)
  private readonly _loaded = signal(false);

  readonly loaded = computed(() => this._loaded());

  /** Observable stream of entities. */
  readonly entities = computed(() => {
    return this._entities().sort((a, b) => a.name.localeCompare(b.name));
  });

  /**
   * Retrieves all fruits.
   * @returns An Observable that emits an array of Fruit objects.
   */
  getAll(): Observable<Fruit[]> {
    return toObservable(this.entities, {
      injector: this._injector,
    }).pipe(
      take(1),
      switchMap((entities) => {
        if (!this._loaded()) {
          const url = this._composeUrl("all");
          return this._http.get<Fruit[]>(url).pipe(
            tap(() => {
              this.setLoaded(true);
              this._entities.set(entities);
            })
          );
        }

        return of(entities);
      }),
      filter(() => this._loaded()),
    );
  }

  /**
   * Retrieves a fruit by its ID.
   * @param id - The ID of the fruit to retrieve.
   * @returns An Observable that emits the fruit with the specified ID.
   */
  getById(id: number): Observable<Fruit> {
    const url = `${this._composeUrl()}/${id}`;
    return this._http
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
    const httpRequests = urls.map((url) => this._http.get<Fruit[]>(url));

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
    this._loaded.set(loaded);
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
    const url = this._baseUrl;
    const keyList = ["all", "family", "genus", "order"];

    return keyList.includes(key) ? `${url}/${key}` : url;
  }

  /**
   * Updates the existing entities with the provided entities or adds them if they don't exist.
   * @param entities - The entities to be patched.
   */
  _patchEntities(entities: Fruit[]): void {
    const currentEntities = this._entities();

    for (let entity of entities) {
      const index = this._entities().findIndex((e) => e.id === entity.id);

      if (index > -1) {
        currentEntities[index] = entity;
      } else {
        currentEntities.push(entity);
      }
    }

    this._entities.set(currentEntities);
  }
}
