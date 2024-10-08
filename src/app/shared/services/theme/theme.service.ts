import { Injectable, computed, effect, signal, untracked } from '@angular/core';
import { Nullable } from '@shared/types';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _theme = signal<'light' | 'dark'>('light');
  /**
   * Determines whether the current theme is dark.
   * @returns {boolean} True if the current theme is dark, false otherwise.
   */
  readonly isDarkActive = computed(() => this._isDark(this._theme()));

  constructor() {
    this._initializeTheme();

    effect(() => {
      const theme = this._theme();
      const isDarkActive = this._isDark(theme);

      untracked(() => {
        this._toggleDarkClass('dark', isDarkActive);
        this._toStorage(theme);
      });
    });
  }

  /**
   * Toggles the theme between light and dark.
   */
  toggleTheme() {
    this._theme.update(currTheme => currTheme === 'dark' ? 'light' : 'dark');
  }

  /**
   * Initializes the theme based on the stored value or the preferred color scheme.
   */
  private _initializeTheme() {
    this._theme.set(this._fromStorage() ?? this._getPreferColorScheme());
  }

  /**
   * Returns the preferred color scheme based on the user's system settings.
   * @returns The preferred color scheme ('dark' or 'light').
   */
  private _getPreferColorScheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' as Theme;
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

  private _fromStorage() {
    return localStorage.getItem('theme') as Nullable<Theme>;
  }

  private _toStorage(theme: Theme) {
    localStorage.setItem('theme', theme);
  }

  private _isDark(theme: Theme) {
    return theme === 'dark';
  }
}
