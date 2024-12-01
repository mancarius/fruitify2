import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MEDIA_SERVICE_CONFIG_TOKEN } from '@tokens';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-settings',
    imports: [MatCardModule, MatListModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'flex flex-col items-center p-4 w-full',
    },
    template: `
    <div class="w-full max-w-screen-sm flex flex-col gap-4">
      <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 m-0">Media</h3>

      <mat-card class="w-full bg-white dark:bg-slate-50/10">
        <mat-card-content class="p-0">
          <mat-nav-list role="list" class="w-full">
            <!-- Photo service -->
            <a mat-list-item role="listitem" [routerLink]="['/settings/media-provider']" class="w-full">
              <div matListItemTitle class="text-black dark:text-white">Provider</div>
              <div matListItemLine class="text-slate-900 dark:text-slate-200 capitalize">{{ provider() }}</div>
            </a>
          </mat-nav-list>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class SettingsComponent {
  readonly #mediaServiceConfig = inject(MEDIA_SERVICE_CONFIG_TOKEN);

  readonly provider = computed(() => this.#mediaServiceConfig()?.provider ?? 'Unknown');
}
