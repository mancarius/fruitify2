import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '@core/components/navbar/navbar.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { injectRouteTitle } from '@shared/helpers';

@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterOutlet, NavbarComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col w-full min-h-dvh',
  },
  template: `
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 shadow-md flex flex-col items-center">
      <app-navbar class="w-full"></app-navbar>
      <div class="w-full max-w-screen-sm flex gap-4 items-center justify-start text-2xl md:text-4xl text-black dark:text-white pl-4 md:pl-0 pb-4 md:pb-2">
        <button mat-icon-button (click)="location.back()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2 class="font-bold m-0">{{ routeTitle() }}</h2>
      </div>
    </header>

    <!-- Main content -->
    <main class="bg-slate-100 dark:bg-gray-800 pb-[80px]">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <footer>
      <app-footer></app-footer>
    </footer>
  `,
})
export class SettingsLayoutComponent {
  location = inject(Location);
  routeTitle = injectRouteTitle();
}

