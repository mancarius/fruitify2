import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Component for a circular progress bar.
 * @example
 * <app-circle-progress
 *    [progress]="50"
 *    [color]="'#ff0000'"
 *    [strokeWidth]="10"
 *    [radius]="50">
 * </app-circle-progress>
 */
@Component({
  selector: 'app-circle-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'overflow-hidden relative'
  },
  template: `
    <svg style="transform: rotate(-90deg)" width="100%" height="100%">
      <circle [attr.r]="radiusPercent()"
              cx="50%"
              cy="50%"
              fill="transparent"
              [style.stroke]="traceColor()"
              [style.stroke-width.%]="traceStrokeWidth()" />

      <circle [attr.r]="radiusPercent()"
              cx="50%"
              cy="50%"
              fill="transparent"
              stroke-linecap="round"
              [style.stroke]="color()"
              [style.stroke-width.%]="strokeWidth()"
              [style.stroke-dasharray.px]="strokeDasharray()"
              [style.stroke-dashoffset.px]="strokeDashoffset()" />
    </svg>
  `
})
export class CircleProgressComponent {
  readonly strokeWidth = input<number>(5);

  readonly color = input<string>('#e0e0e0');

  readonly radius = input<number>(40);

  readonly progress = input<number>(0);

  protected readonly radiusPercent = computed(() => `${this.radius()}%`);
  
  /** Raggio del cerchio */
  protected readonly strokeDashoffset = computed(() =>
    calculateStrokeDashoffset(this.strokeDasharray(), this.progress()));

  /** Lunghezza della traccia */
  protected readonly strokeDasharray = computed<number>(() =>
    calculateStrokeDasharray(this.radius()));

  /** Colore della traccia */
  protected readonly traceColor = computed(() => this.color() + '33');

  /** Larghezza della traccia */
  protected readonly traceStrokeWidth = computed(() => this.strokeWidth() * 1.5);
}



function calculateStrokeDashoffset(strokeDasharray: number, progress: number): number {
  return strokeDasharray - (strokeDasharray * (progress < 100 ? progress : 100)) / 100;
}

function calculateStrokeDasharray(radius: number): number {
  return 2 * Math.PI * radius;
}