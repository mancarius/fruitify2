import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@shared/services/theme/theme.service';

@Component({
  selector: 'app-theme-toggler',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <button mat-icon-button class="dark:text-gray-100 text-yellow-500 transition-colors" (click)="toggleTheme()" [matTooltip]="tooltipMessage()">
      <mat-icon>{{ iconName() }}</mat-icon>
    </button>
  `,
  
})
export class ThemeTogglerComponent {
  private _themeService = inject(ThemeService);

  isDarkTheme = this._themeService.isDarkTheme;
  iconName = computed(() => this.isDarkTheme() ? 'dark_mode' : 'light_mode' );
  tooltipMessage = computed(() => this.isDarkTheme() ?  'Switch to dark theme' : 'Switch to light theme');

  toggleTheme = () => this._themeService.toggleTheme();
}
