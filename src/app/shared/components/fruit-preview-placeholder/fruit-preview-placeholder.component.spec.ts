import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitPreviewPlaceholderComponent } from './fruit-preview-placeholder.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('FruitPreviewPlaceholderComponent', () => {
  let component: FruitPreviewPlaceholderComponent;
  let fixture: ComponentFixture<FruitPreviewPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    })
      .compileComponents();

    fixture = TestBed.createComponent(FruitPreviewPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a spinner with a diameter of 30', () => {
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner.getAttribute('diameter')).toBe('30');
  });
});
