import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Nullable, SearchContext } from '@shared/types';
import { MatSelectModule } from '@angular/material/select';

type ChangeFn = (value: Record<SearchContext, Nullable<string>> | null) => void;
type TouchedFn = () => void;

@Component({
  selector: 'app-fruits-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FruitsSearchComponent),
      multi: true
    }
  ],

  template: `
    <form class="flex gap-4 items-center w-full border border-black dark:border-white rounded" autocomplete="off" (submit)="onSubmit()" [formGroup]="fg">
      <div class="grow flex">
        <mat-select class="w-30 sm:w-40 flex capitalize" formControlName="context">
        @for(option of contextOptions; track option) {
          <mat-option [value]="option" class="capitalize">{{ option }}</mat-option>
        }
        </mat-select>

        <input matInput class="grow bg-transparent pl-4 ml-0 sm:ml-4" formControlName="value" name="searchValue" type="search"
          placeholder="Search fruits by {{ fg.value.context }}" />

        <button mat-icon-button matSuffix aria-label="Search" type="submit" class="dark:text-white text-black">
          <mat-icon>search</mat-icon>
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      :host ::ng-deep .mat-mdc-select-value {
        text-align: left;
        padding-left: 1rem;
      }
    `
  ]
})
export class FruitsSearchComponent implements ControlValueAccessor {
  readonly #defaultContext: SearchContext = "name";
  readonly contextOptions: SearchContext[] = ["name", "order", "genus", "family"];
  readonly fg = new FormGroup({
    context: new FormControl<SearchContext>(this.#defaultContext, { nonNullable: true }),
    value: new FormControl<string>("")
  });

  #change: ChangeFn = () => { };
  #touched: TouchedFn = () => { };

  protected onSubmit() {
    this.#touched();
    const { context = this.#defaultContext, value = null } = this.fg.value;
    this.emitSearchValue(context, value);
  }

  protected emitSearchValue(context: SearchContext, value: Nullable<string>) {
    this.#change({ [context]: value } as { [key in SearchContext]: Nullable<string> });
  }

  writeValue(value: Record<SearchContext, Nullable<string>> | null): void {
    const context = value ? Object.keys(value)[0] as SearchContext : null;
    this.fg.patchValue({
      context: context ?? this.#defaultContext,
      value: context && value ? value[context] : ""
    });
  }

  registerOnChange(fn: ChangeFn): void {
    this.#change = fn;
  }

  registerOnTouched(fn: TouchedFn): void {
    this.#touched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled && this.fg.enabled) this.fg.disable()
    else if (!isDisabled && this.fg.disabled) this.fg.enable();
  }
}
