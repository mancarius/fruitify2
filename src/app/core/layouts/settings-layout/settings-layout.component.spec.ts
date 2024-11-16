import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing'
import { SettingsLayoutComponent } from './settings-layout.component';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { injectRouteTitle } from '@shared/helpers';
import { provideRouter, RouterOutlet } from '@angular/router';
import { Component, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'mock-component',
  template: ''
})
class MockComponent { }

describe('SettingsLayoutComponent', () => {
  let component: SettingsLayoutComponent;
  let fixture: ComponentFixture<SettingsLayoutComponent>;
  let location: Location;
  let loader: HarnessLoader;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SettingsLayoutComponent,
        MatIconModule,
        NavbarComponent,
        FooterComponent
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideLocationMocks(),
        provideRouter([
          { path: '**', title: 'Test Title', component: MockComponent }
        ]),
        { provide: injectRouteTitle, useValue: () => 'Test Title' }
      ]
    })
      .compileComponents();

    harness = await RouterTestingHarness.create();
    fixture = TestBed.createComponent(SettingsLayoutComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component)
      .withContext('Expected to create the settings layout component')
      .toBeTruthy();
  });

  it('should display the correct route title', async () => {
    await harness.navigateByUrl('/');

    const titleElement: HTMLElement = fixture.debugElement.query(By.css('[data-testid="route-title"]')).nativeElement;

    expect(titleElement.textContent)
      .withContext('Expected to display the correct route title')
      .toBe('Test Title');
  });

  it('should call location.back() when back button is clicked', async () => {
    spyOn(location, 'back');

    const backButton = await loader.getAllHarnesses(MatButtonHarness.with({ selector: '[data-testid="location-back-btn"' }));

    expect(backButton.length)
      .withContext('Expected to find back button')
      .toBe(1);

    await backButton[0].click();

    expect(location.back)
      .withContext('Expected to call location.back()')
      .toHaveBeenCalled();
  });

  it('should render the navbar component', () => {
    const navbarElement = fixture.debugElement.query(By.directive(NavbarComponent));

    expect(navbarElement)
      .withContext('Expected to render the navbar component')
      .toBeTruthy();
  });

  it('should render the footer component', () => {
    const footerElement = fixture.debugElement.query(By.directive(FooterComponent));

    expect(footerElement)
      .withContext('Expected to render the footer component')
      .toBeTruthy();
  });

  it('should render the router outlet', () => {
    const routerOutletElement = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(routerOutletElement)
      .withContext('Expected to render the router outlet')
      .toBeTruthy();
  });
});
