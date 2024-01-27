import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { photoResolver } from './photo.resolver';
import { MediaPhoto, Nullable } from '@shared/types';

describe('photoResolver', () => {
  const executeResolver: ResolveFn<Nullable<MediaPhoto>> = (...resolverParameters) => 
    TestBed.runInInjectionContext(() => photoResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
