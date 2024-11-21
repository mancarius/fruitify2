import { Component, input, NO_ERRORS_SCHEMA, provideExperimentalZonelessChangeDetection, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RelatedFruitsComponent, RelatedFruitsContentDirective } from "./related-fruits.component";
import { RelatedFruitsStore } from "./related-fruits.store";
import { FruitService } from "@shared/services/fruit/fruit.service";
import { NEVER, of, throwError } from "rxjs";
import { Fruit } from "@shared/types";
import { MAX_SUGGESTIONS_PREVIEW_OPTION, SHOW_MORE_BUTTON_TEXT } from "@tokens";

@Component({
  standalone: true,
  selector: 'some-component',
  template: ``
})
class SomeComponent {
  fruits = input<Fruit[]>([]);
}

@Component({
  standalone: true,
  selector: 'test-cmp',
  imports: [RelatedFruitsComponent, RelatedFruitsContentDirective, SomeComponent],
  template: `
    <app-related-fruits [fruit]="fruit()">
      @if (showContent()) {
        <ng-template appRelatedFruitsContent let-fruits>
          <some-component [fruits]="fruits"></some-component>
        </ng-template>
      }
    </app-related-fruits>`,
})
class TestWrapperComponent {
  showContent = signal(true);
  fruit = signal<Fruit | null>(null);
}

describe("RelatedFruitsComponent", () => {
  let wrapperCmp: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let fruitService: jasmine.SpyObj<FruitService>;
  let buttonTextMap: { openText: string; closeText: string };
  const fruitMock = { id: 1, name: "Apple", family: "Rosaceae" } as Fruit;

  beforeEach(async () => {
    const fruitServiceSpy = jasmine.createSpyObj('FruitService', ['getWithQuery']);

    TestBed.configureTestingModule({
      imports: [TestWrapperComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        RelatedFruitsStore,
        {
          provide: SHOW_MORE_BUTTON_TEXT,
          useValue: {
            openText: "Show more",
            closeText: "Show less",
          }
        },
        {
          provide: MAX_SUGGESTIONS_PREVIEW_OPTION,
          useValue: 3,
        },
        { provide: FruitService, useValue: fruitServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    wrapperCmp = fixture.componentInstance;
    fruitService = TestBed.inject(FruitService) as jasmine.SpyObj<FruitService>;
    buttonTextMap = TestBed.inject(SHOW_MORE_BUTTON_TEXT);
  });

  it("should create", () => {
    expect(wrapperCmp).toBeTruthy();
  });

  it("should render the loading message", async () => {
    fruitService.getWithQuery.and.returnValue(NEVER);

    wrapperCmp.fruit.set(fruitMock);

    fixture.detectChanges();

    await fixture.whenStable();

    const loadingMessage = fixture.debugElement.query(By.css("[data-testid=loading]"))?.nativeElement;
    expect(loadingMessage).toBeTruthy();
  });

  it("should render the error message when no content is provided", async () => {
    fruitService.getWithQuery.and.returnValue(of([]));

    wrapperCmp.fruit.set(fruitMock);
    wrapperCmp.showContent.set(false);

    fixture.detectChanges();

    await fixture.whenStable();

    const errorMessage = fixture.debugElement.query(By.css("[data-testid=no-content-provided-error-message]")).nativeElement;
    expect(errorMessage).toBeTruthy();
  });

  it("should render the error message", async () => {
    fruitService.getWithQuery.and.returnValue(throwError(() => new Error("Error")));

    wrapperCmp.fruit.set(fruitMock);

    fixture.detectChanges();

    await fixture.whenStable();

    const errorMessage = fixture.debugElement.query(By.css("[data-testid=error-message]"))?.nativeElement;
    expect(errorMessage).toBeTruthy();
  });

  it("should render related fruits except that one received in input", async () => {
    const fruitsMock = [
      fruitMock,
      { id: 2, name: "Apple", family: "Rosaceae" } as Fruit
    ];

    const expected = [
      { id: 2, name: "Apple", family: "Rosaceae" } as Fruit
    ];

    fruitService.getWithQuery.and.returnValue(of(fruitsMock));

    wrapperCmp.fruit.set(fruitMock);

    fixture.detectChanges();

    expect(fruitService.getWithQuery).toHaveBeenCalledWith({ family: "Rosaceae" });

    await fixture.whenStable();

    const fruitComponent = fixture.debugElement.query(By.directive(SomeComponent));
    expect(fruitComponent.nativeElement).toBeTruthy();
    expect(fruitComponent.componentInstance.fruits()).toEqual(expected);
  });

  it("should toggle show more/less button", async () => {
    const fruitsMock = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Fruit ${i + 1}`, family: "Rosaceae" }));
    fruitService.getWithQuery.and.returnValue(of(fruitsMock as Fruit[]));

    wrapperCmp.fruit.set(fruitMock);

    fixture.detectChanges();

    await fixture.whenStable();

    console.log(fixture.debugElement.nativeElement);
    const button = fixture.debugElement.query(By.css("[data-testid=btn-container] a")).nativeElement;
    expect(button).toBeTruthy();
    expect(button.textContent).toContain(buttonTextMap.openText);

    button.click();

    await fixture.whenStable();

    expect(button.textContent).toContain(buttonTextMap.closeText);
  });

  it("should not show the button when there are no more suggestions", async () => {
    const fruits = Array.from({ length: 3 }, (_, i) => ({ id: i + 1, name: `Fruit ${i + 1}`, family: "Rosaceae" }));
    fruitService.getWithQuery.and.returnValue(of(fruits as Fruit[]));

    wrapperCmp.fruit.set(fruitMock);

    fixture.detectChanges();

    await fixture.whenStable();

    const button = fixture.debugElement.query(By.css("[data-testid=btn-container] a"));
    expect(button).toBeNull();
  });
});
