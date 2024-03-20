import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoadingService } from '@shared/services/loading/loading.service';
import { BehaviorSubject } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  const loadingSrv = { loading$: new BehaviorSubject(false) }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: LoadingService,
          useValue: loadingSrv
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render page-loader element when loading is true', () => {
    loadingSrv.loading$.next(true);
    fixture.detectChanges();
    const loader = fixture.nativeElement.querySelector('.page-loader');
    expect(loader).toBeTruthy();
  });

  it('should not render page-loader element when loading is false', () => {
    loadingSrv.loading$.next(false);
    fixture.detectChanges();
    const loader = fixture.nativeElement.querySelector('.page-loader');
    expect(loader).toBeFalsy();
  });

});
