import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from '@shared/services/loading/loading.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MatProgressSpinnerModule],
  host: {
    class: 'grow flex flex-col w-full',
  },
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.3s ease-in-out', style({ opacity: 0 }))
      ]),
    ]),
  ],
  template: `
    <router-outlet></router-outlet>

  @if (loading()) {
    <div class="page-loader fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-900/50" @fade>
      <mat-spinner diameter="80" color="primary"></mat-spinner>
    </div>
  }
  `,
})
export class AppComponent {
  private readonly _loadingSrv = inject(LoadingService);
  readonly loading = toSignal(this._loadingSrv.loading$, { initialValue: false });
}
