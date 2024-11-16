import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the error message', () => {
    const title = fixture.nativeElement.querySelector('h1');
    const paragraph = fixture.nativeElement.querySelector('p');

    expect(title.textContent).toContain('Error');
    expect(paragraph.textContent).toBeTruthy();
  });
});
