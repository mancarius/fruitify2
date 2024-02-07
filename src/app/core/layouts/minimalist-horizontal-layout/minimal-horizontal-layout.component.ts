import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@core/components/footer/footer.component';
import { NavbarComponent } from '@core/components/navbar/navbar.component';

@Component({
  selector: 'app-minimal-horizontal-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  host: {
    class: 'flex flex-col w-full min-h-dvh',
  },
  template: `
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 shadow-md">
      <app-navbar></app-navbar>
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
export class MinimalHorizontalLayoutComponent {}
