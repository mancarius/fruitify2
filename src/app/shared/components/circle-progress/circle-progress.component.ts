import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'overflow-hidden relative'
  },
  template: `
    <svg style="transform: rotate(-90deg)" width="100%" height="100%">
      <circle [attr.r]="radius"
              cx="50%"
              cy="50%"
              fill="transparent"
              [style.stroke]="traceColor"
              [style.stroke-width.%]="strokeWidth" />

      <circle [attr.r]="radius"
              cx="50%"
              cy="50%"
              fill="transparent"
              stroke-linecap="round"
              [style.stroke]="color"
              [style.stroke-width.%]="strokeWidth"
              [style.stroke-dasharray.px]="strokeDasharray"
              [style.stroke-dashoffset.px]="strokeDashoffset" />
    </svg>
  `
})
export class CircleProgressComponent {
  @Input()
  strokeWidth: number = 5;

  @Input()
  color: string = '#e0e0e0';

  @Input()
  radius: number = 40;

  @Input()
  set progress(value: number) {
    this.setStrokeDasharray();
    this.setStrokeDashoffset(value);
  }
  
  protected strokeDashoffset: number = 0;

  protected strokeDasharray: number = 0;

  /** Colore della traccia */
  protected get traceColor() {
    return this.color + '33';
  }

  protected setStrokeDasharray() {
    this.strokeDasharray = 2 * Math.PI * this.radius;
  }

  protected setStrokeDashoffset(progress: number = 0) {
    this.strokeDashoffset = this.strokeDasharray - (this.strokeDasharray * progress) / 100;
  }
}
