import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitPreviewPlaceholderComponent } from './fruit-preview-placeholder.component';

describe('FruitPreviewPlaceholderComponent', () => {
  let component: FruitPreviewPlaceholderComponent;
  let fixture: ComponentFixture<FruitPreviewPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitPreviewPlaceholderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FruitPreviewPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
