import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FruitDetailComponent } from './fruit-detail.component';
import { Component, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FruitNutritionsComponent } from '../fruit-nutritions/fruit-nutritions.component';
import { provideRouter, Router } from '@angular/router';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatNavListItemHarness } from '@angular/material/list/testing';

const mockFruit = {
  order: 'Rosales',
  genus: 'Malus',
  family: 'Rosaceae',
  nutritions: { carbohydrates: 14, protein: 0.3, fat: 0.2, calories: 52, sugar: 10 }
};

@Component({
  selector: 'app-fruit-nutritions',
  standalone: true,
  template: '',
  inputs: ['nutritions'],
})
class FruitNutritionsStubComponent {
  nutritions: any;
}

@Component({ standalone: true, template: '' })
class MockComponent { }

describe('FruitDetailComponent', () => {
  let component: FruitDetailComponent;
  let fixture: ComponentFixture<FruitDetailComponent>;
  let setComponentInput: (name: string, value: unknown) => void;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'fruits', component: MockComponent }]),
        provideExperimentalZonelessChangeDetection()
      ]
    })
      .overrideComponent(FruitDetailComponent, {
        remove: { imports: [FruitNutritionsComponent] },
        add: { imports: [FruitNutritionsStubComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(FruitDetailComponent);
    component = fixture.componentInstance;
    setComponentInput = fixture.componentRef.setInput.bind(fixture.componentRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when fruit is provided', () => {

    beforeEach(() => {
      setComponentInput('fruit', mockFruit);
      fixture.detectChanges();
    });

    it('should display fruit details when fruit is provided', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('h3').textContent).toContain('Classification');
    });

    it('should correctly render order information', () => {
      const orderElement = fixture.debugElement.query(By.css('a[mat-list-item] p')).nativeElement;
      expect(orderElement.textContent).toContain('Rosales');
    });

    it('should correctly render genus information', () => {
      const genusElement = fixture.debugElement.queryAll(By.css('a[mat-list-item] p'))[1].nativeElement;
      expect(genusElement.textContent).toContain('Malus');
    });

    it('should correctly render family information', () => {
      const familyElement = fixture.debugElement.queryAll(By.css('a[mat-list-item] p'))[2].nativeElement;
      expect(familyElement.textContent).toContain('Rosaceae');
    });

    it('should not display "Nothing to show" message when fruit is provided', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent)
        .withContext('Expected "Nothing to show" message to be not displayed')
        .not.toContain('Nothing to show');
    });

    it('should update correctly when fruit input changes dynamically', () => {
      setComponentInput('fruit', {
        order: 'Sapindales', genus: 'Citrus', family: 'Rutaceae', nutritions: { carbohydrates: 8, protein: 0.9, fat: 0.1, calories: 29, sugar: 2.5 }
      });
      fixture.detectChanges();
      const orderElement = fixture.debugElement.query(By.css('a[mat-list-item] p')).nativeElement;
      expect(orderElement.textContent)
        .withContext('Expected order to be updated')
        .toContain('Sapindales');
    });

    describe('Classification', () => {
      it('should handle fruit with empty string properties', () => {
        const compiled = fixture.nativeElement;
        expect(compiled.textContent)
          .withContext('Expected "Order" text to be displayed')
          .toContain('Order');
        expect(compiled.textContent)
          .withContext('Expected "Genus" text to be displayed')
          .toContain('Genus');
        expect(compiled.textContent)
          .withContext('Expected "Family" text to be displayed')
          .toContain('Family');
      });

      it('should display correct order when fruit.order is a long string', () => {
        const longString = 'a'.repeat(100);
        setComponentInput('fruit', { ...mockFruit, order: longString });
        fixture.detectChanges();
        const orderElement = fixture.debugElement.query(By.css('a[mat-list-item] p')).nativeElement;
        expect(orderElement.textContent)
          .withContext('Expected order to be updated')
          .toContain(longString);
      });

      it('should display correct genus when fruit.genus is a long string', () => {
        const longString = 'a'.repeat(100);
        setComponentInput('fruit', { ...mockFruit, genus: longString });
        fixture.detectChanges();
        const genusElement = fixture.debugElement.queryAll(By.css('a[mat-list-item] p'))[1].nativeElement;
        expect(genusElement.textContent)
          .withContext('Expected genus to be updated')
          .toContain(longString);
      });

      it('should not crash when fruit has special characters in properties', () => {
        setComponentInput('fruit', { ...mockFruit, order: '!@#$%^&*()' });
        fixture.detectChanges();
        const orderElement = fixture.debugElement.query(By.css('a[mat-list-item] p')).nativeElement;
        expect(orderElement.textContent)
          .withContext('Expected order to be updated')
          .toContain('!@#$%^&*()');
      });

      it('should display correct family when fruit.family is a long string', () => {
        const longString = 'a'.repeat(100);
        setComponentInput('fruit', { ...mockFruit, family: longString });
        fixture.detectChanges();
        const familyElement = fixture.debugElement.queryAll(By.css('a[mat-list-item] p'))[2].nativeElement;
        expect(familyElement.textContent)
          .withContext('Expected family to be updated')
          .toContain(longString);
      });

      it('should navigate to fruits page with correct query params on classificatin item click', async () => {
        const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);
        const listItem = await loader.getHarness(MatNavListItemHarness.with({ title: 'Order' }));

        await listItem.click();

        expect(TestBed.inject(Router).url).toEqual('/fruits?order=Rosales');
      });
    });

    describe('Nutritions', () => {
      it('should display nutritions when fruit.nutritions is provided', () => {
        const componentInstance = fixture.debugElement.query(By.directive(FruitNutritionsStubComponent)).componentInstance;
        expect(componentInstance)
          .withContext('Expected FruitNutritionsComponent to be defined')
          .toBeDefined();
      });

      it('should render nutritions component with correct data', () => {
        const nutritionsComponent = fixture.debugElement.query(By.directive(FruitNutritionsStubComponent)).componentInstance;
        expect(nutritionsComponent.nutritions).toEqual({ carbohydrates: 14, protein: 0.3, fat: 0.2, calories: 52, sugar: 10 });
      });

      it('should handle fruit with undefined nutritions property', () => {
        setComponentInput('fruit', { ...mockFruit, nutritions: undefined });
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.textContent)
          .withContext('Expected "No nutritions available" message to be displayed')
          .toContain('Nutritions');
      });

      it('should display "No nutritions available" message when fruit.nutritions is not provided', () => {
        setComponentInput('fruit', { ...mockFruit, nutritions: null });
        fixture.detectChanges();
        const componentInstance = fixture.debugElement.query(By.directive(FruitNutritionsStubComponent))?.componentInstance;
        expect(componentInstance)
          .withContext('Expected FruitNutritionsComponent to be not defined')
          .not.toBeDefined();
        const compiled = fixture.nativeElement.querySelector('[data-testid="no-nutritions-available"]');
        expect(compiled)
          .withContext('Expected "No nutritions available" message to be displayed')
          .toBeDefined();
      });
    });
  });

  describe('when fruit is not provided', () => {

    beforeEach(() => {
      setComponentInput('fruit', null);
      fixture.detectChanges();
    });

    it('should display "Nothing to show" message when fruit is not provided', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Nothing to show');
    });
  });
});
