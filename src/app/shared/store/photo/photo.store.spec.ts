import { TestBed } from '@angular/core/testing';
import { PhotoStore } from './photo.store';
import { MediaService } from '../../../shared/services/media/media.service';
import { of } from 'rxjs';

fdescribe('PhotoStore', () => {
  let store: PhotoStore;
  let mediaService: MediaService;

  beforeEach(() => {
    mediaService = jasmine.createSpyObj('MediaService', ['findPhoto']);

    TestBed.configureTestingModule({
      providers: [
        PhotoStore,
        { provide: MediaService, useValue: mediaService },
      ],
    });

    store = TestBed.inject(PhotoStore);
  });

  it('should fetch the photo', () => {
    const fruit = { name: 'Apple' } as any;
    const photo = { url: 'apple.jpg' } as any;
    (mediaService.findPhoto as jasmine.Spy).and.returnValue(of(photo));

    store.fetchPhoto(fruit);

    TestBed.flushEffects();

    expect(mediaService.findPhoto).toHaveBeenCalledWith(fruit.name);
    expect(store.photo()).toEqual(photo);
    expect(store.loading()).toBe(false);
  });

  it('should not fetch the photo when fruit is null', () => {
    store.fetchPhoto(null);

    expect(store.loading()).toBe(false);
    expect(mediaService.findPhoto).not.toHaveBeenCalled();
    expect(store.photo()).toBeNull();
  });
});