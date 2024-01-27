import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitNutritionViewComponent } from './fruit-nutrition-view.component';

describe('FruitNutritionViewComponent', () => {
  let component: FruitNutritionViewComponent;
  let fixture: ComponentFixture<FruitNutritionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitNutritionViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FruitNutritionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
