import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimalHorizontalLayoutComponent } from './minimal-horizontal-layout.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('MinimalistHorizontalLayoutComponent', () => {
  let component: MinimalHorizontalLayoutComponent;
  let fixture: ComponentFixture<MinimalHorizontalLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinimalHorizontalLayoutComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient()
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MinimalHorizontalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .withContext('Expected component instance to be truthy')
      .toBeTruthy();
  });

  it('should render the header section', () => {
    const headerElement = fixture.nativeElement.querySelector('header');
    expect(headerElement)
      .withContext('Expected header element to be truthy')
      .toBeTruthy();
  });

  it('should render the main content section', () => {
    const mainElement = fixture.nativeElement.querySelector('main');
    expect(mainElement)
      .withContext('Expected main element to be truthy')
      .toBeTruthy();
  });

  it('should render the footer section', () => {
    const footerElement = fixture.nativeElement.querySelector('footer');
    expect(footerElement)
      .withContext('Expected footer element to be truthy')
      .toBeTruthy();
  });

  it('should contain app-navbar component', () => {
    const navbarElement = fixture.debugElement.query(By.directive(NavbarComponent));
    expect(navbarElement)
      .withContext('Expected app-navbar component to be truthy')
      .toBeTruthy();
  });

  it('should contain app-footer component', () => {
    const footerElement = fixture.debugElement.query(By.directive(FooterComponent));
    expect(footerElement)
      .withContext('Expected app-footer component to be truthy')
      .toBeTruthy();
  });

  it('should contain router-outlet in the main content', () => {
    const routerOutletElement = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutletElement)
      .withContext('Expected router-outlet element to be truthy')
      .toBeTruthy();
  });

});
