import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ThemeTogglerComponent } from '@shared/components/theme-toggler/theme-toggler.component';
import { MatRippleModule } from '@angular/material/core';

@Component({
    selector: 'app-navbar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ThemeTogglerComponent,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        MatRippleModule,
    ],
    template: `
    <nav class="w-full flex flex-wrap items-center justify-between px-2 py-3">
      <div
        class="container px-4 mx-auto flex flex-wrap items-stretch justify-between"
      >
        <div class="relative flex lg:w-auto lg:static lg:block">
          <a
            class="text-sm font-bold leading-relaxed mr-4 ml-2 py-2 whitespace-nowrap uppercase flex items-center"
            routerLink="/"
          >
            Fruitify
          </a>
        </div>

        <div class="ml-auto flex gap-4">
          <app-theme-toggler></app-theme-toggler>
          <button
            mat-icon-button
            class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block md:hidden outline-none focus:outline-none text-white"
            type="button"
            (click)="toggleNavbar()"
            data-testid="toggle-navbar-btn"
            aria-label="Toggle navigation"
          >
            @let icon = showMenu() ? 'menu_open' : 'menu';
            <mat-icon class="opacity-80 text-gray-900 dark:text-gray-100 ">{{icon}}</mat-icon>
          </button>
        </div>

        <div
          class="absolute md:relative top-full left-0 w-full md:w-auto md:flex items-stretch bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent md:shadow-none"
          [class.hidden]="!showMenu()" [class.block]="showMenu()"
        >
          <ul class="flex flex-col md:flex-row md:items-stretch list-none md:ml-auto">
            <li class="flex items-stretch">
              <a
                class="px-3 py-4 md:py-2 flex items-center text-xs uppercase font-bold w-full md:rounded-full"
                matRipple
                routerLink="/settings"
                aria-label="Settings"
              >
                <mat-icon class="opacity-80">settings</mat-icon>
                <span class="md:hidden inline-block ml-2">Settings</span>
              </a>
            </li>

            <li class="flex items-stretch">
              <a
                [href]="ghLink"
                matRipple
                class="px-3 py-4 md:py-2 flex items-center text-xs uppercase font-bold w-full md:rounded-full"
                aria-label="Github"
              >
                <mat-icon svgIcon="github" class="opacity-80"></mat-icon>
                <span class="md:hidden inline-block ml-2">Github</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  readonly showMenu = signal(false);
  protected readonly ghLink = 'https://github.com/mancarius/fruitify2';

  toggleNavbar() {
    this.showMenu.update(v => !v);
  }
}
