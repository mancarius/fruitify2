import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FruitListComponent } from './fruit-list.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';


const fruitsMock = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' }
];

describe('FruitListComponent', () => {
  let component: FruitListComponent;
  let fixture: ComponentFixture<FruitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([])
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(FruitListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the list of fruits', async () => {
    // Arrange
    fixture.componentRef.setInput('fruits', fruitsMock);

    // Act
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    const fruitElements = fixture.debugElement?.queryAll(By.css('li'));
    expect(fruitElements.length).toBe(2);
  });

  it('should display the list of fruits with the correct link url', async () => {
    // Arrange
    fixture.componentRef.setInput('fruits', fruitsMock);

    // Act
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    const fruitLinkElements = fixture.debugElement.queryAll(By.css('a')).map(a => (a.nativeElement as HTMLAnchorElement));
    expect(fruitLinkElements[0].href).toContain('apple');
    expect(fruitLinkElements[1].href).toContain('banana');
  })

  it('should display no-fruit-message element when the list is empty', async () => {
    // Arrange
    fixture.componentRef.setInput('fruits', []);

    // Act
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    const noFruitsElement = fixture.debugElement.query(By.css('[data-testid="no-fruits-message"]'));
    expect(noFruitsElement).toBeTruthy();
  });
});
