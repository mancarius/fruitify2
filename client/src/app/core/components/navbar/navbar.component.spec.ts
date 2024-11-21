import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from './navbar.component';
import { provideRouter } from '@angular/router';
import { ThemeTogglerComponent } from '@shared/components/theme-toggler/theme-toggler.component';
import { Component, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

@Component({ selector: 'app-theme-toggler', template: '', standalone: true })
class ThemeTogglerStubComponent { }

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
      ]
    })
      .overrideComponent(NavbarComponent, {
        remove: {
          imports: [ThemeTogglerComponent],
        },
        add: {
          imports: [ThemeTogglerStubComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle showMenu when toggleNavbar is called', () => {
    const togglerBtn = fixture.debugElement.query(By.css('[data-testid="toggle-navbar-btn"]'));
    expect(component.showMenu()).toBeFalse();
    togglerBtn.nativeElement.click();
    expect(component.showMenu()).toBeTrue();
    togglerBtn.nativeElement.click();
    expect(component.showMenu()).toBeFalse();
  });


  it('should render the settings link with correct routerLink', () => {
    const settingsLink = fixture.debugElement.query(By.css('a[routerLink="/settings"]'));
    expect(settingsLink).toBeTruthy();
  });

  it('should render the theme toggler component', () => {
    const themeToggler = fixture.debugElement.query(By.directive(ThemeTogglerStubComponent));
    expect(themeToggler).toBeTruthy();
  });

  it('should render the menu button with correct icon', () => {
    const button = fixture.debugElement.query(By.css('button[mat-icon-button]'));
    expect(button).toBeTruthy();
    const icon = button.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('menu');
    component.toggleNavbar();
    fixture.detectChanges();
    expect(icon.nativeElement.textContent.trim()).toBe('menu_open');
  });
});
