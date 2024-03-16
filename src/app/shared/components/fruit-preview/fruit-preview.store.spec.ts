import { FruitPreviewStore } from './fruit-preview.store';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MediaService } from '@shared/services';

describe('FruitPreviewStore', () => {
  let store: FruitPreviewStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MediaService, useValue: jasmine.createSpyObj('MediaService', ['findPhoto']) },
        FruitPreviewStore
      ]
    });
    store = TestBed.inject(FruitPreviewStore);
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

  it('should set the fruit', () => {
    // Arrange
    // Stop the fetchPhoto method from being called
    const fruit = { name: 'Apple' } as any;

    spyOn(store, 'fetchPhoto').and.stub();

    // Act
    store.setFruit(fruit);

    // Assert
    expect(store.vm().fruitName).toEqual(fruit.name);
  });

  it('should fetch the photo', fakeAsync(() => {
    // Arrange
    const fruit = { name: 'Apple' } as any;
    const photo = { url: 'apple.jpg' } as any;

    spyOn(store, 'fetchPhoto').and.callThrough();
    spyOn(store, 'patchState').and.callThrough();
    spyOn<any>(store, '_findPhoto').and.resolveTo(photo);

    // Act
    store.fetchPhoto(fruit.name);

    tick();

    // Assert
    expect(store['_findPhoto']).toHaveBeenCalledWith(fruit.name);
    expect(store.patchState).toHaveBeenCalledWith({ photo, loaded: true });
  }));

  it('should handle the error', fakeAsync(() => {
    // Arrange
    const fruit = { name: 'Apple' } as any;
    const error = new Error('Failed to fetch photo');

    spyOn(store, 'fetchPhoto').and.callThrough();
    spyOn(store, 'patchState').and.callThrough();
    spyOn<any>(store, '_findPhoto').and.rejectWith(error);

    // Act
    store.fetchPhoto(fruit.name);

    tick();

    // Assert
    expect(store.patchState).toHaveBeenCalledWith({ error, loaded: false });
  }));
});