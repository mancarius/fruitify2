import { Injectable, inject } from '@angular/core';
import { Fruit, QueryParams } from '@shared/types';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, map, shareReplay, take, tap } from 'rxjs';
import { API_BASE_PATHNAME } from '@shared/constants';

@Injectable({
  providedIn: 'root'
})
export class FruitService {
  private _baseUrl = API_BASE_PATHNAME;
  private _entities = new BehaviorSubject<Fruit[]>([]);
  private _http = inject(HttpClient);

  /**
   * Observable stream of entities.
   */
  public readonly entities$ = this._entities.asObservable().pipe(shareReplay(1));

  /**
   * Retrieves all fruits.
   * @returns An Observable that emits an array of Fruit objects.
   */
  public getAll(): Observable<Fruit[]> {
    if (this._entities.value.length === 0) {
      const url = this._composeUrl('all');
      return this._http.get<Fruit[]>(url).pipe(
        tap(entities => this._entities.next(entities))
      );
    }

    return this.entities$.pipe(take(1));
  }

  /**
   * Retrieves a fruit by its ID.
   * @param id - The ID of the fruit to retrieve.
   * @returns An Observable that emits the fruit with the specified ID.
   */
  public getById(id: number): Observable<Fruit> {
    const url = `${this._composeUrl()}/${id}`;
    return this._http.get<Fruit>(url);
  }

  /**
   * Retrieves an array of fruits based on the provided query parameters.
   * @param query - The query parameters to filter the fruits.
   * @returns An observable that emits an array of fruits.
   */
  public getWithQuery(query: QueryParams<keyof Omit<Fruit, 'nutritions' | 'id'>>): Observable<Fruit[]> {
    return forkJoin(Object.entries(query).map(([key, value]) => this._http.get<Fruit[]>(`${this._composeUrl(key)}/${value}`)))
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
  private _composeUrl(key: string = ''): string {
    const url = this._baseUrl;
    const keyList = ['all', 'family', 'genus', 'order'];

    return keyList.includes(key) ? `${url}/${key}` : url;
  }
}
