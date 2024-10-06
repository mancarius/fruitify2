import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FruitPreviewComponent } from './fruit-preview.component';
import { By } from '@angular/platform-browser';
import { DebugElement, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { Fruit, MediaPhoto, MediaSize } from '@shared/types';
import { of } from 'rxjs';
import { MediaService } from '@shared/services';
import { PHOTO_DEFAULT_OPTIONS } from '@tokens';

describe('FruitPreviewComponent', () => {
  let fixture: ComponentFixture<FruitPreviewComponent>;
  let debugElement: DebugElement;
  let mediaService: jasmine.SpyObj<MediaService>;

  const mockFruit = { name: 'Apple' } as Fruit;
  const mockPhoto = {
    url: { [MediaSize.SMALL]: 'http://example.com/apple.jpg' },
    alt: 'Apple photo',
  } as MediaPhoto;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitPreviewComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: MediaService,
          useValue: jasmine.createSpyObj("MediaService", ['findPhoto']),
        },
        {
          provide: PHOTO_DEFAULT_OPTIONS,
          useValue: { width: 100, height: 100 },
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FruitPreviewComponent);
    debugElement = fixture.debugElement;
    mediaService = TestBed.inject(MediaService) as jasmine.SpyObj<MediaService>;
  });

  it('should display the fruit name', async () => {
    mediaService.findPhoto.and.returnValue(of(mockPhoto));

    fixture.componentRef.setInput('fruit', mockFruit);
    fixture.detectChanges();

    await fixture.whenStable();

    const nameContainer = debugElement.query(By.css('[data-testid=name-container] span'));
    expect(nameContainer.nativeElement.textContent).toContain(mockFruit.name);
  });

  it('should display the fruit photo', async () => {
    mediaService.findPhoto.and.returnValue(of(mockPhoto));

    fixture.componentRef.setInput('fruit', mockFruit);
    fixture.detectChanges();

    await fixture.whenStable();

    const photoContainer = debugElement.query(By.css('[data-testid=photo-container] img'));
    expect(photoContainer.nativeElement.src).toContain(mockPhoto.url[MediaSize.SMALL]);
    expect(photoContainer.nativeElement.alt).toBe(mockPhoto.alt);
  });

  it('should not display the photo container if imgUrl is null', async () => {
    mediaService.findPhoto.and.returnValue(of({
      url: {
        [MediaSize.SMALL]: undefined,
      },
      alt: 'Apple photo',
    } as MediaPhoto));

    fixture.componentRef.setInput('fruit', mockFruit);
    fixture.detectChanges();

    await fixture.whenStable();

    const photoContainer = debugElement.query(By.css('[data-testid=photo-container]'));
    expect(photoContainer).toBeNull();
  });
});
