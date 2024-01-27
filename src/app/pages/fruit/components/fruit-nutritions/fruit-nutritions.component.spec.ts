import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitNutritionsComponent } from './fruit-nutritions.component';

describe('FruitNutritionsComponent', () => {
  let component: FruitNutritionsComponent;
  let fixture: ComponentFixture<FruitNutritionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitNutritionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FruitNutritionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
