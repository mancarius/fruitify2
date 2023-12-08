import { TestBed } from '@angular/core/testing';
import { FruitStore } from './fruit.store';
import { MediaService } from '../../shared/services/media/media.service';
import { of } from 'rxjs';

fdescribe('FruitStore', () => {
  let store: FruitStore;
  let mediaService: MediaService;

  beforeEach(() => {
    mediaService = jasmine.createSpyObj('MediaService', ['findPhoto']);

    TestBed.configureTestingModule({
      providers: [
        FruitStore,
        { provide: MediaService, useValue: mediaService },
      ],
    });

    store = TestBed.inject(FruitStore);
  });

  it('should set the fruit', () => {
    const fruit = { name: 'Apple' } as any;
    store.setFruit(fruit);
    expect(store.fruit()).toEqual(fruit);
  });

  it('should fetch the photo when fruit changes', () => {
    const fruit = { name: 'Apple' } as any;
    const photo = { url: 'apple.jpg' } as any;
    (mediaService.findPhoto as jasmine.Spy).and.returnValue(of(photo));

    store.setFruit(fruit);

    TestBed.flushEffects();

    expect(mediaService.findPhoto).toHaveBeenCalledWith(fruit.name);
    expect(store.photo()).toEqual(photo);
    expect(store.loading()).toBe(false);
  });

  it('should not fetch the photo when fruit is null', () => {
    store.setFruit(null);

    expect(store.loading()).toBe(false);
    expect(mediaService.findPhoto).not.toHaveBeenCalled();
    expect(store.photo()).toBeNull();
  });
});