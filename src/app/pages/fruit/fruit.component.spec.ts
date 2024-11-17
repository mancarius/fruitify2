import { ComponentFixture, DeferBlockBehavior, DeferBlockFixture, DeferBlockState, TestBed } from '@angular/core/testing';
import { FruitComponent } from './fruit.component';
import { Component, input, NO_ERRORS_SCHEMA, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { MAX_SUGGESTIONS_PREVIEW_OPTION } from '@tokens';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FruitDetailComponent } from './components/fruit-detail/fruit-detail.component';
import { FruitListComponent } from '@shared/components/fruit-list/fruit-list.component';
import { RelatedFruitsComponent } from '@shared/components/related-fruits/related-fruits.component';

@Component({ selector: 'app-fruit-list', standalone: true, template: '' })
class FruitListStubComponent {
  fruits = input<any>();
}

@Component({ selector: 'app-fruit-detail', standalone: true, template: '' })
class FruitDetailStubComponent {
  fruit: any = input<any>();
}

@Component({ selector: 'app-related-fruits', standalone: true, template: '' })
class RelatedFruitsStubComponent {
  fruit: any = input<any>();
  maxSuggestions: any = input<any>();
}

fdescribe('FruitComponent', () => {
  const mockFruit = { name: 'Apple' };
  let component: FruitComponent;
  let fixture: ComponentFixture<FruitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      deferBlockBehavior: DeferBlockBehavior.Manual,
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: MAX_SUGGESTIONS_PREVIEW_OPTION,
          useValue: 5,
        }
      ],
    })
      .overrideComponent(FruitComponent, {
        remove: {
          imports: [
            FruitListComponent,
            FruitDetailComponent,
            RelatedFruitsComponent
          ],
        },
        add: {
          imports: [
            FruitListStubComponent,
            FruitDetailStubComponent,
            RelatedFruitsStubComponent
          ],
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(FruitComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fruit', mockFruit);
    fixture.componentRef.setInput('photo', { url: { lg: 'http://example.com/apple.jpg' } });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct fruit name in the header', () => {
    const headerElement: HTMLTitleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(headerElement.textContent)
      .withContext('Expected the header to contain the fruit name')
      .toContain(mockFruit.name);
  });

  it('should set the hero background image correctly based on the fruit photo URL', () => {
    const expectedBackgroundImage = 'url("http://example.com/apple.jpg")';
    const headerEl: HTMLHeadingElement = fixture.debugElement.query(By.css('header')).nativeElement;

    expect(headerEl.style.backgroundImage)
      .withContext('Expected the header background image to be set correctly')
      .toBe(expectedBackgroundImage);
  });

  it('should pass the correct fruit data to the fruit detail component', () => {
    const fruitDetailComponent = fixture.debugElement.query(By.directive(FruitDetailStubComponent)).componentInstance;
    expect(fruitDetailComponent.fruit())
      .withContext('Expected the fruit detail component to receive the correct fruit data')
      .toEqual(mockFruit);
  });

  it('should scroll to the top when fruit data changes', () => {
    const scrollToSpy = spyOn(window, 'scrollTo').and.stub();
    fixture.componentRef.setInput('fruit', { name: 'Banana' });
    fixture.detectChanges();
    expect(scrollToSpy)
      .withContext('Expected window.scrollTo to be called with the correct arguments')
      .toHaveBeenCalledOnceWith({ top: 0, behavior: 'smooth' });
  });

  it('should render correctly when fruit is null', () => {
    fixture.componentRef.setInput('fruit', null);
    fixture.detectChanges();
    const headerElement: HTMLTitleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(headerElement.textContent?.trim())
      .withContext('Expected the header to be absent when fruit is null')
      .toBeFalsy();
  });

  describe('Related fruits section', () => {
    let deferBlock: DeferBlockFixture;

    beforeEach(async () => {
      deferBlock = (await fixture.getDeferBlocks())[0];
    });

    it('should not display the related fruits section when fruit data is null', () => {
      fixture.componentRef.setInput('fruit', null);
      fixture.detectChanges();
      const relatedFruitsSection = fixture.debugElement.query(By.css('[data-testid="related-fruits"]'));
      expect(relatedFruitsSection)
        .withContext('Expected the related fruits section to be absent when fruit data is null')
        .toBeNull();
    });

    it('should display the related fruits section when fruit data is provided', () => {
      const relatedFruitsSection = fixture.debugElement.query(By.css('[data-testid="related-fruits"]'));
      expect(relatedFruitsSection)
        .withContext('Expected the related fruits section to be displayed')
        .toBeTruthy();
    });

    it('should display the loading placeholder when related fruits are being loaded', async () => {
      const placeholderText = 'Loading related fruits...';
      await deferBlock.render(DeferBlockState.Placeholder);
      const placeholderElement = fixture.debugElement.query(By.css('[data-testid="related-fruits-placeholder"]'));
      expect(placeholderElement.nativeElement.textContent)
        .withContext('Expected the loading placeholder to be displayed')
        .toContain(placeholderText);
    });

    it('should display the loading text when related fruits are loading', async () => {
      const loadingText = 'Loading...';
      await deferBlock.render(DeferBlockState.Loading);
      const loadingElement = fixture.debugElement.query(By.css('[data-testid="related-fruits-loading"]'));
      expect(loadingElement.nativeElement.textContent)
        .withContext('Expected the loading text to be displayed')
        .toContain(loadingText);
    });

    it('should pass the correct maxSuggestions and fruit values to the related fruits component', async () => {
      await deferBlock.render(DeferBlockState.Complete);
      const relatedFruitsComponent = fixture.debugElement.query(By.directive(RelatedFruitsStubComponent)).componentInstance;
      expect(relatedFruitsComponent.maxSuggestions())
        .withContext('Expected the related fruits component to receive the correct maxSuggestions value')
        .toBe(component.maxSuggestions);
      expect(relatedFruitsComponent.fruit())
        .withContext('Expected the related fruits component to receive the correct fruit data')
        .toEqual(mockFruit);
    });
  });
});
