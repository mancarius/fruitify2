import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoadingService } from '@shared/services/loading/loading.service';
import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let loadingSrvMock = { loading: signal(false) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideNoopAnimations(),
        {
          provide: LoadingService,
          useValue: loadingSrvMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render page-loader element when loading is true', async () => {
    loadingSrvMock.loading.set(true);

    await fixture.whenStable();

    const loader = fixture.nativeElement.querySelector('[data-testid="loading-frame"]');
    expect(loader).toBeTruthy();
  });

  it('should not render page-loader element when loading is false', async () => {
    loadingSrvMock.loading.set(false);

    await fixture.whenStable();

    const loader = fixture.nativeElement.querySelector('[data-testid="loading-frame"]');
    expect(loader).toBeFalsy();
  });
});
