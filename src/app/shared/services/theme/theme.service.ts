import { Injectable, computed, effect, signal, untracked } from '@angular/core';
import { Nullable } from '@shared/types';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly #theme = signal<'light' | 'dark'>('light');
  readonly isDarkTheme = computed(() => this.#theme() === 'dark');

  constructor() {
    const storedTheme = localStorage.getItem('theme') as Nullable<Theme>;
    const preferColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' as Theme;
    this.#theme.set(storedTheme || preferColorScheme);

    effect(() => {
      localStorage.setItem('theme', untracked(this.#theme));
      this.#toggleDarkClass('dark', this.isDarkTheme());
    });
  }

  toggleTheme() {
    this.#theme.set(this.isDarkTheme() ? 'light' : 'dark');
  }

  #toggleDarkClass(className: string, isDarkActive: boolean) {
    if (isDarkActive) {
      this.#addClass(className);
    } else {
      this.#removeClass(className);
    }
  }

  #addClass(className: string) {
    document.body.classList.add(className);
  }

  #removeClass(className: string) {
    document.body.classList.remove(className);
  }
}
