import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FruitsComponent } from './fruits.component';
import { FruitsSearchComponent } from '@shared/components/fruits-search/fruits-search.component';
import { FruitListComponent } from '@shared/components/fruit-list/fruit-list.component';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Component, provideExperimentalZonelessChangeDetection, signal, Input } from '@angular/core';
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
          { path: 'fruits', component: FruitsComponent },
          { path: '**', redirectTo: '/fruits' },
        ]),
      ]
    })
      .overrideComponent(FruitsComponent, {
        remove: { imports: [FruitListComponent] },
        add: { imports: [FruitListStubComponent] }
      })
      .compileComponents();

    harness = await RouterTestingHarness.create();
    fixture = TestBed.createComponent(FruitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero section and search component', () => {
    const heroSection = fixture.debugElement.query(By.css('.hero-bg'));
    const searchComponent = fixture.debugElement.query(By.directive(FruitsSearchComponent));
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
    await harness.navigateByUrl('/fruits?name=apple');
    fixture.detectChanges();
    expect(component.searchControl.value)
      .withContext('The search control value should be { name: "apple" }')
      .toEqual({ name: 'apple' } as any);
  });

  it('should navigate to /fruits with correct query params when search control value changes', () => {
    component.searchControl.setValue({ name: 'banana' } as any);

    fixture.detectChanges();

    expect(TestBed.inject(Router).url)
      .withContext('The URL should be /fruits')
      .toBe('/fruits');
    expect(TestBed.inject(ActivatedRoute).snapshot.queryParams)
      .withContext('The query params should be { name: "banana" }')
      .toEqual({ name: 'banana' });
  });

  it('should render the correct number of fruits', () => {
    component['cs'].fruits = signal([{ name: 'Apple' }, { name: 'Banana' }] as any);
    fixture.detectChanges();
    const fruitList = fixture.debugElement.query(By.directive(FruitListStubComponent));
    expect(fruitList.componentInstance.fruits.length)
      .withContext('The number of fruits should be 2')
      .toBe(2);
  });

  it('should display the correct number of found fruits', () => {
    component['cs'].fruits = signal([{ name: 'Apple' }] as any);
    fixture.detectChanges();
    const foundFruitsText = fixture.debugElement.query(By.css('.text-sm')).nativeElement.textContent;
    expect(foundFruitsText)
      .withContext('The text should be "Found 1 fruit."')
      .toContain('Found 1 fruit.');
  });

  it('should navigate to /fruits when "Show all" link is clicked', () => {
    const showAllLink: HTMLAnchorElement = fixture.debugElement.query(By.css('[data-testid="reset-filters"]')).nativeElement;
    showAllLink.click();
    fixture.detectChanges();
    expect(TestBed.inject(Router).url)
      .withContext('The URL should be /fruits')
      .toBe('/fruits');
    expect(TestBed.inject(ActivatedRoute).snapshot.queryParams)
      .withContext('The query params should be an empty object')
      .toEqual({});
  });
});
