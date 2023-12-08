import { TestBed } from '@angular/core/testing';
import { FruitsStore } from './fruits.store';
import { FruitService } from '../../shared/services/fruit/fruit.service';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { of, skip, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Fruit } from '../../shared/types';

describe('FruitsStore', () => {
  let fruitServiceSpy: jasmine.SpyObj<FruitService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let store: FruitsStore;

  beforeEach(() => {
    fruitServiceSpy = jasmine.createSpyObj<FruitService>('FruitService', ['getAll', 'getWithQuery']);
    loadingServiceSpy = jasmine.createSpyObj<LoadingService>('LoadingService', ['start', 'stop'], { isLoading$: of(false) });

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        FruitsStore,
        { provide: FruitService, useValue: fruitServiceSpy},
        { provide: LoadingService, useValue: loadingServiceSpy },
      ]
    });
    
    store = TestBed.inject(FruitsStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });



  describe('#_startLoading', () => {

    it('should exists a _startLoading method', () => {
      expect(store['_startLoading']).toBeTruthy();
    });

    it('should call LoadingService#startLoading once', () => {
      store['_startLoading']();
      expect(store['_loadingService'].start).toHaveBeenCalledTimes(1);
    });

  });



  describe('#_stopLoading', () => {

    it('should exists a _stopLoading method', () => {
      expect(store['_stopLoading']).toBeTruthy();
    });

    it('should call LoadingService#stopLoading once', () => {
      store['_stopLoading']();
      expect(store['_loadingService'].stop).toHaveBeenCalledTimes(1);
    });

  });



  describe('#fetchFruits', () => {

    it('should exists a fetchFruits method', () => {
      expect(store.fetchFruits).toBeTruthy();
    });

    it('should call _startLoading, _stopLoading and FruitService#getAll once', (done: DoneFn) => {
      spyOn<any>(store, '_startLoading').and.stub();
      spyOn<any>(store, '_stopLoading').and.stub();
      fruitServiceSpy.getAll.and.resolveTo();

      store.fruits$.pipe(skip(1), take(1)).subscribe((fruits) => {
        expect(store['_startLoading']).toHaveBeenCalledTimes(1);
        expect(store['_stopLoading']).toHaveBeenCalledTimes(1);
        expect(fruitServiceSpy.getAll).toHaveBeenCalledTimes(1);
        done();
      });

      store.fetchFruits();
    });

    it('should update state with given fruits', (done: DoneFn) => {
      const fruits = [<Fruit>{ id: 1, name: 'banana' }, <Fruit>{ id: 2, name: 'apple' }];
      fruitServiceSpy.getAll.and.returnValue(of(fruits));

      store.fruits$.pipe(skip(1), take(1)).subscribe((fruits) => {
        expect(fruits).toEqual(fruits);
        done();
      });

      store.fetchFruits();
    });

    it('should update state with given error', (done: DoneFn) => {
      const error = new HttpErrorResponse({ error: 'error' });
      fruitServiceSpy.getAll.and.throwError(error);

      store.error$.pipe(skip(1), take(1)).subscribe((err) => {
        expect(err).toEqual(error.message);
        done();
      });

      store.fetchFruits();
    });

  });



  describe('#getFruitByName', () => {

    it('should exists a getFruitByName method', () => {
      expect(store.getFruitByName).toBeTruthy();
    });

    it('should call _startLoading and _stopLoading once', (done: DoneFn) => {
      spyOn<any>(store, '_startLoading').and.stub();
      spyOn<any>(store, '_stopLoading').and.stub();
      fruitServiceSpy.getWithQuery.and.resolveTo();

      store.fruits$.pipe(skip(1), take(1)).subscribe(() => {
        expect(store['_startLoading']).toHaveBeenCalledTimes(1);
        expect(store['_stopLoading']).toHaveBeenCalledTimes(1);
        done();
      });

      store.getFruitByName('');
    });

    it('should call FruitService#getWithQuery once with correct params', (done: DoneFn) => {
      const searchText = 'searchText';
      fruitServiceSpy.getWithQuery.and.resolveTo();

      store.fruits$.pipe(skip(1), take(1)).subscribe(() => {
        expect(fruitServiceSpy.getWithQuery).toHaveBeenCalledOnceWith({ name: searchText });
        done();
      });

      store.getFruitByName(searchText);
    });

    it('should update state with given fruit', (done: DoneFn) => {
      const fruits = [<Fruit>{ id: 1, name: 'banana' }];
      fruitServiceSpy.getWithQuery.and.returnValue(of(fruits));

      store.fruits$.pipe(skip(1), take(1)).subscribe((fruits) => {
        expect(fruits).toEqual(fruits);
        done();
      });

      store.getFruitByName('banana');
    });

    it('should update state with given error', (done: DoneFn) => {
      const error = new HttpErrorResponse({ error: 'error' });
      fruitServiceSpy.getWithQuery.and.throwError(error);

      store.error$.pipe(skip(1), take(1)).subscribe((err) => {
        expect(err).toEqual(error.message);
        done();
      });

      store.getFruitByName('banana');
    });

  });

});