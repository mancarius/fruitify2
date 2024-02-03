import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ThemeTogglerComponent } from '@shared/components/theme-toggler/theme-toggler.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ThemeTogglerComponent, MatButtonModule, MatIconModule, RouterLink],

  template: `
    <nav class="w-full flex flex-wrap items-center justify-between px-2 py-3">
      <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="w-full relative flex lg:w-auto lg:static lg:block">
          <a class="text-sm font-bold leading-relaxed inline-block mr-4 ml-2 py-2 whitespace-nowrap uppercase text-blue-950 dark:text-white flex items-center"
            routerLink="/">
            Fruitify
          </a>
        </div>

        <div class="ml-auto flex gap-4">
          <app-theme-toggler></app-theme-toggler>
          <button mat-icon-button
            class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none text-white"
            type="button" (click)="toggleNavbar()">
            <mat-icon class="text-blue-950 dark:text-white opacity-80">{{ showMenu ? 'menu_open' : 'menu' }}</mat-icon>
          </button>
        </div>

        <div
          class="lg:flex items-center bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent lg:shadow-none"
          [ngClass]="{'hidden': !showMenu, 'block': showMenu}">
          <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li class="flex items-center">
              <a class="lg:text-white lg:hover:text-blue-950 dark:text-white dark:hover:text-blue-950 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold w-full "
                routerLink="/settings">
                <mat-icon class="text-blue-950 dark:text-white opacity-80">settings</mat-icon>
                <span class="lg:hidden inline-block ml-2">Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  protected showMenu = false;

  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }
}
