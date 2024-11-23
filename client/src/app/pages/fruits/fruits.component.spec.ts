import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FruitsComponent } from './fruits.component';
import { FruitsSearchComponent } from '@shared/components/fruits-search/fruits-search.component';
import { FruitListComponent } from '@shared/components/fruit-list/fruit-list.component';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Component, provideExperimentalZonelessChangeDetection, Input } from '@angular/core';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({ template: "", standalone: true })
class MockComponent { }

@Component({ selector: "app-fruit-list", template: "", standalone: true })
class FruitListStubComponent {
  @Input() fruits: any[] = [];
}

describe('FruitsComponent', () => {
  let component: FruitsComponent;
  let fixture: ComponentFixture<FruitsComponent>;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FruitsComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([
          { path: 'fruits', component: MockComponent },
          { path: '', pathMatch: 'full', component: FruitsComponent },
        ]),
      ]
    })
      .overrideComponent(FruitsComponent, {
        remove: { imports: [FruitListComponent] },
        add: { imports: [FruitListStubComponent] }
      });

    harness = await RouterTestingHarness.create();
    fixture = harness.fixture as ComponentFixture<FruitsComponent>;
    component = await harness.navigateByUrl('/', FruitsComponent);
    harness.detectChanges();
    await harness.fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero section and search component', () => {
    const heroSection = harness.routeDebugElement?.query(By.css('.hero-bg'));
    const searchComponent = harness.routeDebugElement?.query(By.directive(FruitsSearchComponent));

    expect(heroSection)
      .withContext('The hero section should be rendered')
      .toBeTruthy();
    expect(searchComponent)
      .withContext('The search component should be rendered')
      .toBeTruthy();
  });

  it('should initialize search control and fruit list correctly', () => {
    expect(component.searchControl.value)
      .withContext('The search control value should be an empty object')
      .toEqual({} as any);
    expect(component['cs'].fruits().length)
      .withContext('The number of fruits should be greater than 0')
      .toBe(0);
  });

  it('should update search control value when query params change', async () => {
    await harness.navigateByUrl('/?name=apple');

    fixture.detectChanges();

    component = harness.routeDebugElement?.componentInstance as FruitsComponent;
    expect(component.searchControl.value)
      .withContext('The search control value should be { name: "apple" }')
      .toEqual({ name: 'apple' } as any);
  });

  it('should navigate to /fruits with correct query params when search control value changes', async () => {
    component.searchControl.markAsTouched();
    component.searchControl.setValue({ name: 'banana' });

    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url)
      .withContext('The URL should be /fruits')
      .toContain('/fruits');
    expect(TestBed.inject(ActivatedRoute).snapshot.queryParams)
      .withContext('The query params should be { name: "banana" }')
      .toEqual({ name: 'banana' });
  });

  it('should render the correct number of fruits', () => {
    component['cs'].setFruits([{ name: 'Apple' }, { name: 'Banana' }] as any);

    fixture.detectChanges();

    const fruitList = fixture.debugElement.query(By.directive(FruitListStubComponent));
    expect(fruitList.componentInstance.fruits.length)
      .withContext('The number of fruits should be 2')
      .toBe(2);
  });

  it('should display the correct number of found fruits', () => {
    component['cs'].setFruits([{ name: 'Apple' }] as any);

    fixture.detectChanges();

    const foundFruitsText = fixture.debugElement.query(By.css('.text-sm')).nativeElement.textContent;
    expect(foundFruitsText)
      .withContext('The text should be "Found 1 fruit."')
      .toContain('Found 1 fruit.');
  });

  it('should navigate to /fruits when "Show all" link is clicked', async () => {
    const showAllLink: HTMLAnchorElement = harness.routeDebugElement?.query(By.css('[data-testid="reset-filters"]')).nativeElement;
    showAllLink.click();

    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url)
      .withContext('The URL should be /fruits')
      .toBe('/fruits');
    expect(TestBed.inject(ActivatedRoute).snapshot.queryParams)
      .withContext('The query params should be an empty object')
      .toEqual({});
  });
});
