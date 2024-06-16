import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ThemeTogglerComponent } from '@shared/components/theme-toggler/theme-toggler.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ThemeTogglerComponent, MatButtonModule, MatIconModule, RouterLink],

  template: `
    <nav class="w-full flex flex-wrap items-center justify-between px-2 py-3">
      <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="relative flex lg:w-auto lg:static lg:block">
          <a class="text-sm font-bold leading-relaxed inline-block mr-4 ml-2 py-2 whitespace-nowrap uppercase flex items-center"
            routerLink="/">
            Fruitify
          </a>
        </div>

        <div class="ml-auto flex gap-4">
          <app-theme-toggler></app-theme-toggler>
          <button mat-icon-button
            class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none text-white"
            type="button" (click)="toggleNavbar()">
            <mat-icon class="opacity-80 text-gray-900 dark:text-gray-100 ">{{ showMenu ? 'menu_open' : 'menu' }}</mat-icon>
          </button>
        </div>

        <div
          class="lg:flex items-center bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent lg:shadow-none"
          [ngClass]="{'hidden': !showMenu, 'block': showMenu}">
          <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">

            <li class="flex items-center">
              <a class="px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold w-full"
                routerLink="/settings">
                <mat-icon class="opacity-80">settings</mat-icon>
                <span class="lg:hidden inline-block ml-2">Settings</span>
              </a>
            </li>

            <li class="flex items-center">
              <a [href]="ghLink" class="px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold w-full">
                <mat-icon svgIcon="github" class="opacity-80"></mat-icon>
                <span class="lg:hidden inline-block ml-2">Github</span>
              </a>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);

  protected showMenu = false;
  protected ghLink = 'https://github.com/mancarius/fruitify2';

  constructor() {
    this.#matIconRegistry.addSvgIcon('github', this.#domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'));
  }

  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }
}
