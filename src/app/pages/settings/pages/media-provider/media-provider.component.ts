import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, Injector, ViewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MediaServiceProvider, Nullable } from '@shared/types';
import { MediaProviderStore } from './media-provider.store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { provideComponentStore } from '@ngrx/component-store';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-media-provider',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  providers: [provideComponentStore(MediaProviderStore)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col items-center p-4 w-full',
  },
  template: `
    <div class="w-full max-w-screen-sm flex flex-col gap-4">
      <mat-card class="w-full bg-white dark:bg-slate-50/10">
        <mat-card-content class="p-0">
          <p class="text-black dark:text-white p-2 m-2">Select the provider to use to load media</p>
          <mat-selection-list #providers [multiple]="false" (selectionChange)="setProvider($event)">
          @for(provider of vm()?.providers|keyvalue; track provider.key) {
            <mat-list-option role="listitem" lines="2" color="primary" [value]="provider.value.name">
              <div matListItemTitle class="text-black dark:text-white">
                <span class="capitalize font-bold">{{ provider.value.name }}</span>
                <a [href]="provider.value.link" class="text-sm ml-3 text-blue-700 hover:underline">{{ provider.value.link }}</a>
              </div>
              <div matListItemLine class="truncate text-black dark:text-white">{{ provider.value.description }}</div>
            </mat-list-option>
          }
          </mat-selection-list>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class MediaProviderComponent implements AfterViewInit {
  private readonly _injector = inject(Injector);
  private readonly _cs = inject(MediaProviderStore);
  private readonly _selectedProvider = toSignal(this._cs.provider$, { initialValue: null });
  @ViewChild('providers') readonly providers!: MatSelectionList;
  protected readonly vm = toSignal(this._cs.vm$);

  ngAfterViewInit(): void {
    effect(() => {
      this._selectOption(this._selectedProvider());
    }, { injector: this._injector });
  }

  /**
   * Sets the media provider based on the selected option.
   * 
   * @param event - The MatSelectionListChange event containing the selected option.
   */
  setProvider(event: MatSelectionListChange): void {
    const providerName = event.source.selectedOptions.selected[0].value as MediaServiceProvider['name'];
    this._cs.selectProvider(providerName);
  }

  /**
   * Selects the list option with the specified value.
   * 
   * @param optionValue The value of the option to select.
   */
  private _selectOption(optionValue: Nullable<MediaServiceProvider>): void {
    const option = this.providers.options.find(option => option.value === optionValue?.name);
    if (option)
      this.providers.selectedOptions.select(option);
    else
      this.providers.selectedOptions.clear();
  }
}
