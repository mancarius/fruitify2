import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitNutritionViewComponent } from './fruit-nutrition-view.component';
import { By } from '@angular/platform-browser';
import { CircleProgressComponent } from '@shared/components/circle-progress/circle-progress.component';
import { NUTRITION_COLORS, NUTRITION_DEFAULT_COLOR } from '@shared/constants';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

fdescribe('FruitNutritionViewComponent', () => {
  let component: FruitNutritionViewComponent;
  let fixture: ComponentFixture<FruitNutritionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitNutritionViewComponent, CircleProgressComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: NUTRITION_COLORS, useValue: { protein: 'blue' } },
        { provide: NUTRITION_DEFAULT_COLOR, useValue: 'gray' }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FruitNutritionViewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('nutrition', { name: 'protein', value: 50 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .withContext('Expected component instance to be truthy')
      .toBeTruthy();
  });

  it('should display the correct nutrition value', () => {
    const valueElement: HTMLParagraphElement = fixture.nativeElement.querySelector('p');
    expect(valueElement.textContent?.trim())
      .withContext('Expected the value to be 50g')
      .toContain('50g');
  });

  it('should display the correct nutrition name', () => {
    const nameElement: HTMLTitleElement = fixture.nativeElement.querySelector('h3');
    expect(nameElement.textContent?.trim())
      .withContext('Expected the name to be protein')
      .toBe('protein');
  });

  it('should apply the correct color to the progress circle', () => {
    const circleProgress = fixture.debugElement.query(By.directive(CircleProgressComponent)).componentInstance;
    expect(circleProgress.color())
      .withContext('Expected the color to be blue')
      .toBe('blue');
  });

  it('should apply the default color if nutrition color is not found', () => {
    fixture.componentRef.setInput('nutrition', { name: 'unknown', value: 50 });
    fixture.detectChanges();
    const circleProgress = fixture.debugElement.query(By.directive(CircleProgressComponent)).componentInstance;
    expect(circleProgress.color())
      .withContext('Expected the color to be gray')
      .toBe('gray');
  });

  it('should apply red color to percentage text if it exceeds 100%', () => {
    fixture.componentRef.setInput('nutrition', { name: 'protein', value: 150 });
    fixture.detectChanges();
    const percentageElement = fixture.nativeElement.querySelector('[data-testid="recommended-daily-intake-percentage"]');

    expect(parseInt(percentageElement.textContent?.trim()))
      .withContext('Expected the percentage to be greater than 100')
      .toBeGreaterThan(100);

    expect(percentageElement.classList.contains('text-red-600'))
      .withContext('Expected the text to be red')
      .toBeTrue();
  });
});
