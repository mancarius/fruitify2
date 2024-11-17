import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FruitNutritionsComponent } from './fruit-nutritions.component';
import { Component, provideExperimentalZonelessChangeDetection, Input, DebugElement } from '@angular/core';
import { FruitNutritionViewComponent } from '../fruit-nutrition-view/fruit-nutrition-view.component';
import { By } from '@angular/platform-browser';

const mockNutritionMap = {
  calories: 50,
  carbohydrates: 10,
  fat: 5,
  protein: 2,
  sugar: 5
}

@Component({
  selector: 'app-fruit-nutrition-view',
  standalone: true,
  inputs: ['nutrition'],
  template: ''
})
class FruitNutritionViewStubComponent {
  nutrition: any;
}

describe('FruitNutritionsComponent', () => {
  let component: FruitNutritionsComponent;
  let fixture: ComponentFixture<FruitNutritionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection()
      ],
    })
      .overrideComponent(FruitNutritionsComponent, {
        remove: { imports: [FruitNutritionViewComponent] },
        add: { imports: [FruitNutritionViewStubComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(FruitNutritionsComponent);
    component = fixture.componentInstance;
  });

  describe('when nutritions are provided', () => {
    let nutritionViews: DebugElement[];
    const expectedNutritions = [
      { name: 'calories', value: 50 },
      { name: 'carbohydrates', value: 10 },
      { name: 'fat', value: 5 },
      { name: 'protein', value: 2 }
    ];

    beforeEach(() => {
      fixture.componentRef.setInput('nutritions', mockNutritionMap);
      fixture.detectChanges();
      nutritionViews = fixture.debugElement.queryAll(By.directive(FruitNutritionViewStubComponent));
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render a list of nutritions correctly', () => {
      expect(nutritionViews.length)
        .withContext('Expected to find 4 nutrition views')
        .toBe(4);
    });

    it('should pass the nutritions to the nutrition views', () => {
      const nutritionValues = nutritionViews.map(nutritionView => nutritionView.componentInstance.nutrition);
      expect(nutritionValues)
        .withContext('Expected the nutrition views to receive the correct nutritions')
        .toEqual(expectedNutritions);
    });

    it('should update the displayed nutritions when the input changes', () => {
      const newNutritionMap = {
        calories: 100,
        carbohydrates: 20,
        fat: 10,
        protein: 4,
        sugar: 10
      };

      const expectedNutritions = [
        { name: 'calories', value: 100 },
        { name: 'carbohydrates', value: 20 },
        { name: 'fat', value: 10 },
        { name: 'protein', value: 4 },
        { name: 'sugar', value: 10 }
      ];

      fixture.componentRef.setInput('nutritions', newNutritionMap);
      fixture.detectChanges();

      const nutritionViews = fixture.debugElement.queryAll(By.directive(FruitNutritionViewStubComponent));
      const nutritionValues = nutritionViews.map(nutritionView => nutritionView.componentInstance.nutrition);
      expect(nutritionValues)
        .withContext('Expected the nutrition views to receive the updated nutritions')
        .toEqual(expectedNutritions);
    });
  });

  describe('when nutritions are not provided', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('nutritions', []);
      fixture.detectChanges();
    });

    it('should display a no nutritions available message', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('[data-testid="no-nutritions-message"]'))
        .withContext('Expected to find a message indicating that no nutritions are available')
        .toBeTruthy();
    });
  });
});
