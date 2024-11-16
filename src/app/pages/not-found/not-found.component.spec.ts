import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .withContext('Expected component instance to be truthy')
      .toBeTruthy();
  });

  it('should display the correct title', () => {
    const titleElement: HTMLTitleElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(titleElement.textContent).toBe('404 - Not Found');
  });

  it('should display the correct paragraph text', () => {
    const paragraphElement: HTMLParagraphElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(paragraphElement.textContent).toContain('It seems like you are lost. Please,');
  });

  it('should have a link that navigates to the home page', () => {
    const linkElement: HTMLAnchorElement = fixture.debugElement.query(By.css('a')).nativeElement;
    expect(linkElement.getAttribute('href')).toBe('/');
    expect(linkElement.textContent).toBe('go back to the safe zone');
  });
});
