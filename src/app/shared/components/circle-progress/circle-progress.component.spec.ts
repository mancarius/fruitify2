import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleProgressComponent } from './circle-progress.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('CircleProgressComponent', () => {
  let component: CircleProgressComponent;
  let fixture: ComponentFixture<CircleProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleProgressComponent],
      providers: [provideExperimentalZonelessChangeDetection()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CircleProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default progress of 0', () => {
    expect(component.progress()).toBe(0);
  });

  it('should have a default color of #e0e0e0', () => {
    expect(component.color()).toBe('#e0e0e0');
  });

  it('should have a default radius of 40', () => {
    expect(component.radius()).toBe(40);
  });

  it('should have a default strokeWidth of 5', () => {
    expect(component.strokeWidth()).toBe(5);
  });

  it('should have a radiusPercent of 40%', () => {
    expect(component['radiusPercent']()).toBe('40%');
  });

  it('should have a strokeDashoffset of 251.32741228718345', () => {
    expect(component['strokeDashoffset']()).toBe(251.32741228718345);
  });

  it('should have a strokeDasharray of 251.32741228718345', () => {
    expect(component['strokeDasharray']()).toBe(251.32741228718345);
  });

  it('should have a traceColor of #e0e0e033', () => {
    expect(component['traceColor']()).toBe('#e0e0e033');
  });

  it('should update progress when input changes', () => {
    fixture.componentRef.setInput('progress', 75);
    fixture.detectChanges();
    expect(component.progress()).toBe(75);
    expect(component['strokeDashoffset']()).toBeCloseTo(62.83185307179586, 5);
  });

  it('should update color when input changes', () => {
    fixture.componentRef.setInput('color', '#00ff00');
    fixture.detectChanges();
    expect(component.color()).toBe('#00ff00');
    expect(component['traceColor']()).toBe('#00ff0033');
  });

  it('should update radius when input changes', () => {
    fixture.componentRef.setInput('radius', 60);
    fixture.detectChanges();
    expect(component.radius()).toBe(60);
    expect(component['radiusPercent']()).toBe('60%');
    expect(component['strokeDasharray']()).toBeCloseTo(376.99111843077515, 5);
  });

  it('should update strokeWidth when input changes', () => {
    fixture.componentRef.setInput('strokeWidth', 8);
    fixture.detectChanges();
    expect(component.strokeWidth()).toBe(8);
    expect(component['traceStrokeWidth']()).toBe(12);
  });

  it('should render the correct DOM structure', () => {
    const svgElement = fixture.nativeElement.querySelector('svg');
    expect(svgElement).toBeTruthy();
    const circles = svgElement.querySelectorAll('circle');
    expect(circles.length).toBe(2);
    expect(circles[0].getAttribute('r')).toBe('40%');
    expect(circles[1].getAttribute('r')).toBe('40%');
  });
});
