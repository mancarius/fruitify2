import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MediaProvidersEnum, Nullable } from '@shared/types';
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
      <mat-card class="w-full bg-slate-100 dark:bg-slate-50/10">
        <mat-card-content>
          <mat-selection-list #providers [multiple]="false" (selectionChange)="setProvider($event)">
          @for(provider of vm()?.providers; track provider) {
            <mat-list-option role="listitem" [value]="provider">
              <span class="capitalize text-black dark:text-white">{{ provider }}</span>
            </mat-list-option>
          }
          </mat-selection-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: ``
})
export class MediaProviderComponent implements AfterViewInit {
  private _cs = inject(MediaProviderStore);
  private _destroy$ = inject(DestroyRef);

  @ViewChild('providers') providers!: MatSelectionList;

  readonly vm = toSignal(this._cs.vm$);

  ngAfterViewInit(): void {
    this._selectOption(this._cs.provider$);
  }

  /**
   * Sets the media provider based on the selected option.
   * 
   * @param event - The MatSelectionListChange event containing the selected option.
   */
  setProvider(event: MatSelectionListChange): void {
    const provider = event.source.selectedOptions.selected[0].value as MediaProvidersEnum;
    this._cs.selectProvider(provider);
  }

  /**
   * Selects the list option with the specified value.
   * 
   * @param optionValue$ The value of the option to select.
   */
  private _selectOption(optionValue$: Observable<Nullable<MediaProvidersEnum>>): Subscription {
    return optionValue$.pipe(
      takeUntilDestroyed(this._destroy$),
    ).subscribe(optionValue => {
      const option = this.providers.options.find(option => option.value === optionValue);
      option && this.providers.selectedOptions.select(option);
    });
  }
}
