import { Injectable, computed, effect, signal, untracked } from '@angular/core';
import { Nullable } from '@shared/types';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme = signal<'light' | 'dark'>('light');
  isDarkTheme = computed(() => this._theme() === 'dark');

  constructor() {
    const storedTheme = localStorage.getItem('theme') as Nullable<Theme>;
    const preferColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' as Theme;
    this._theme.set(storedTheme || preferColorScheme);

    effect(() => {
      localStorage.setItem('theme', untracked(this._theme));
      this._toggleDarkClass('dark', this.isDarkTheme());
    });
  }

  toggleTheme() {
    this._theme.set(this.isDarkTheme() ? 'light' : 'dark');
  }

  private _toggleDarkClass(className: string, isDarkActive: boolean) {
    if (isDarkActive) {
      this._addClass(className);
    } else {
      this._removeClass(className);
    }
  }

  private _addClass(className: string) {
    document.body.classList.add(className);
  }

  private _removeClass(className: string) {
    document.body.classList.remove(className);
  }
}
