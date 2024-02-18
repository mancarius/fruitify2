import { Injectable, inject } from '@angular/core';
import { Fruit, QueryParams } from '@shared/types';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, map, shareReplay, take, tap } from 'rxjs';
import { API_BASE_PATHNAME } from '@shared/constants';

@Injectable({
  providedIn: 'root'
})
export class FruitService {
  readonly #baseUrl = API_BASE_PATHNAME;
  readonly #entities = new BehaviorSubject<Fruit[]>([]);
  readonly #http = inject(HttpClient);

  /**
   * Observable stream of entities.
   */
  readonly entities$ = this.#entities.asObservable().pipe(shareReplay(1));

  /**
   * Retrieves all fruits.
   * @returns An Observable that emits an array of Fruit objects.
   */
  getAll(): Observable<Fruit[]> {
    if (this.#entities.value.length === 0) {
      const url = this.#composeUrl('all');
      return this.#http.get<Fruit[]>(url).pipe(
        tap(entities => this.#entities.next(entities))
      );
    }

    return this.entities$.pipe(take(1));
  }

  /**
   * Retrieves a fruit by its ID.
   * @param id - The ID of the fruit to retrieve.
   * @returns An Observable that emits the fruit with the specified ID.
   */
  getById(id: number): Observable<Fruit> {
    const url = `${this.#composeUrl()}/${id}`;
    return this.#http.get<Fruit>(url);
  }

  /**
   * Retrieves an array of fruits based on the provided query parameters.
   * @param query - The query parameters to filter the fruits.
   * @returns An observable that emits an array of fruits.
   */
  getWithQuery(query: QueryParams<keyof Omit<Fruit, 'nutritions' | 'id'>>): Observable<Fruit[]> {
    return forkJoin(Object.entries(query).map(([key, value]) => this.#http.get<Fruit[]>(`${this.#composeUrl(key)}/${value}`)))
      .pipe(map((results) => results.flat()));
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
}
