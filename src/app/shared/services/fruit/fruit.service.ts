import { Injectable, inject } from '@angular/core';
import { Fruit, QueryParams } from '@shared/types';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, forkJoin, map, shareReplay, tap } from 'rxjs';
import { API_BASE_PATHNAME } from '@shared/constants';

@Injectable({
  providedIn: 'root'
})
export class FruitService {
  readonly #baseUrl = API_BASE_PATHNAME;
  readonly #entities = new BehaviorSubject<Fruit[]>([]);
  readonly #http = inject(HttpClient);
  readonly #loaded = new BehaviorSubject<boolean>(false);

  /** Observable stream of entities. */
  readonly entities$ = this.#entities.pipe(
    map(function(fruits) { return fruits.sort((a, b) => a.name.localeCompare(b.name)) }),
    shareReplay(1));


  /**
   * Retrieves all fruits.
   * @returns An Observable that emits an array of Fruit objects.
   */
  getAll(): Observable<Fruit[]> {
    return this.entities$.pipe(
      tap(() => {
        if (!this.#loaded.value) {
          const url = this.#composeUrl('all');
          this.#http.get<Fruit[]>(url).subscribe(entities => {
            this.setLoaded(true);
            this.#entities.next(entities);
          });
        }
      }),
      filter(() => this.#loaded.value),
    );
  }


  /**
   * Retrieves a fruit by its ID.
   * @param id - The ID of the fruit to retrieve.
   * @returns An Observable that emits the fruit with the specified ID.
   */
  getById(id: number): Observable<Fruit> {
    const url = `${this.#composeUrl()}/${id}`;
    return this.#http.get<Fruit>(url).pipe(
      tap(entity => this.#patchEntities([entity]))
    );
  }


  /**
   * Retrieves an array of fruits based on the provided query parameters.
   * @param query - The query parameters to filter the fruits.
   * @returns An observable that emits an array of fruits.
   */
  getWithQuery(query: QueryParams<keyof Omit<Fruit, 'nutritions' | 'id'>>): Observable<Fruit[]> {
    return forkJoin(Object.entries(query).map(([key, value]) => this.#http.get<Fruit[]>(`${this.#composeUrl(key)}/${value}`)))
      .pipe(
        map((results) => results.flat()),
        tap(entities => this.#patchEntities(entities)),
        map(function(fruits) { return fruits.sort((a, b) => a.name.localeCompare(b.name)) }),
      );
  }


  /**
   * Sets the loaded state of the fruit service.
   * @param loaded - The loaded state to set.
   */
  setLoaded(loaded: boolean): void {
    this.#loaded.next(loaded);
  }


  /**
   * Composes the URL based on the provided key.
   * If the key is included in the keyList, it appends the key to the base URL.
   * Otherwise, it returns the base URL.
   * 
   * @param key - The key to be appended to the URL.
   * @returns The composed URL.
   */
  #composeUrl(key: string = ''): string {
    const url = this.#baseUrl;
    const keyList = ['all', 'family', 'genus', 'order'];

    return keyList.includes(key) ? `${url}/${key}` : url;
  }


  /**
   * Updates the existing entities with the provided entities or adds them if they don't exist.
   * @param entities - The entities to be patched.
   */
  #patchEntities(entities: Fruit[]): void {
    const currentEntities = this.#entities.value;

    for (let entity of entities) {
      const index = this.#entities.value.findIndex(e => e.id === entity.id);

      if (index > -1) {
        currentEntities[index] = entity;
      } else {
        currentEntities.push(entity);
      }
    }

    this.#entities.next(currentEntities);
  }
}
