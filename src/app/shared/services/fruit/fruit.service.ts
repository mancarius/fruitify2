import { Injectable } from '@angular/core';
import { Fruit, QueryParams } from '@shared/types';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { API_BASE_PATHNAME } from '@shared/constants';

@Injectable({
  providedIn: 'root'
})
export class FruitService {
  private _baseUrl = API_BASE_PATHNAME;

  constructor(private _http: HttpClient) { }

  /**
   * Retrieves all fruits.
   * @returns An Observable that emits an array of Fruit objects.
   */
  public getAll(): Observable<Fruit[]> {
    const url = this._composeUrl('all');
    return this._http.get<Fruit[]>(url);
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
