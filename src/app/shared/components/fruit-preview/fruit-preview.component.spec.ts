import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitPreviewComponent } from './fruit-preview.component';

describe('FruitPreviewComponent', () => {
  let component: FruitPreviewComponent;
  let fixture: ComponentFixture<FruitPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FruitPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
