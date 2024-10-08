import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTogglerComponent } from './theme-toggler.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('ThemeTogglerComponent', () => {
  let component: ThemeTogglerComponent;
  let fixture: ComponentFixture<ThemeTogglerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeTogglerComponent],
      providers: [provideExperimentalZonelessChangeDetection()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ThemeTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the button icon when clicked', async () => {
    // Arrange
    const button = fixture.nativeElement.querySelector('[data-testid="theme-toggler"]');
    let previousIconName = button.textContent;

    // Act
    button.click();

    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    expect(button.textContent).not.toBe(previousIconName);
    expect(button.textContent).toBe(component.iconName());
    previousIconName = button.textContent;

    // Act
    button.click();

    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    expect(button.textContent).not.toBe(previousIconName);
    expect(button.textContent).toBe(component.iconName());
  });
});
