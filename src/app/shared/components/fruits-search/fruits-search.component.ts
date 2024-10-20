import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  OnInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  TouchedChangeEvent,
  StatusChangeEvent
} from "@angular/forms";
import { Nullable, SearchContext } from "@shared/types";
import { MatSelectModule } from "@angular/material/select";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

type ChangeFn = (value: Record<SearchContext, Nullable<string>> | null) => void;
type TouchedFn = () => void;

@Component({
  selector: "app-fruits-search",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FruitsSearchComponent),
      multi: true,
    },
  ],

  template: `
    <form
      class="flex gap-4 items-center w-full border border-black dark:border-white rounded"
      autocomplete="off"
      (submit)="onSubmit()"
      [formGroup]="fg"
    >
      <div class="grow flex">
        <mat-select
          class="w-30 sm:w-40 flex capitalize"
          formControlName="context"
        >
          @for (option of contextOptions; track option) {
            <mat-option [value]="option" class="capitalize">{{
              option
            }}</mat-option>
          }
        </mat-select>

        <input
          matInput
          class="grow bg-transparent pl-4 ml-0 sm:ml-4"
          formControlName="value"
          name="searchValue"
          type="search"
          placeholder="Search fruits by {{ fg.value.context }}"
        />

        <button
          mat-icon-button
          matSuffix
          aria-label="Search"
          type="submit"
          class="dark:text-white text-black"
          [disabled]="fg.disabled"
        >
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
    `,
  ],
})
export class FruitsSearchComponent implements OnInit, ControlValueAccessor {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _cdRef = inject(ChangeDetectorRef);
  private readonly _defaultContext: SearchContext = "name";
  readonly contextOptions: SearchContext[] = [
    "name",
    "order",
    "genus",
    "family",
  ];
  readonly fg = new FormGroup({
    context: new FormControl<SearchContext>(this._defaultContext, {
      nonNullable: true,
    }),
    value: new FormControl<string>(""),
  });

  private _change: ChangeFn = () => { };
  private _touched: TouchedFn = () => { };

  ngOnInit() {
    this.fg.events
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((event) => {
        if (event instanceof TouchedChangeEvent) {
          this._touched();
        }
        if (event instanceof StatusChangeEvent) {
          this._cdRef.markForCheck();
        }
      });
  }

  protected onSubmit() {
    this._touched();
    const { context = this._defaultContext, value = null } = this.fg.value;
    this.emitSearchValue(context, value);
  }

  protected emitSearchValue(context: SearchContext, value: Nullable<string>) {
    this._change({ [context]: value } as {
      [key in SearchContext]: Nullable<string>;
    });
  }

  writeValue(value: Record<SearchContext, Nullable<string>> | null): void {
    this.fg.patchValue(this._getContextAndValueFromObj(value));
  }

  registerOnChange(fn: ChangeFn): void {
    this._change = fn;
  }

  registerOnTouched(fn: TouchedFn): void {
    this._touched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this._disableForm();
    } else {
      this._enableForm();
    }
  }

  private _disableForm() {
    this.fg.enabled && this.fg.disable();
  }

  private _enableForm() {
    this.fg.disabled && this.fg.enable();
  }

  private _getContextAndValueFromObj(
    value: Record<SearchContext, Nullable<string>> | null,
  ): {
    context: SearchContext;
    value: Nullable<string>;
  } {
    const context = value ? (Object.keys(value)[0] as SearchContext) : null;
    return {
      context: context ?? this._defaultContext,
      value: context && value ? value[context] : "",
    };
  }
}
