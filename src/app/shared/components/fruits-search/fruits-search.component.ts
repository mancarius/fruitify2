import { Component, forwardRef } from '@angular/core';
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
  templateUrl: './fruits-search.component.html',
  styleUrl: './fruits-search.component.scss'
})
export class FruitsSearchComponent implements ControlValueAccessor {
  private _defaultContext: SearchContext = "name";
  protected fg = new FormGroup({ context: new FormControl<SearchContext>(this._defaultContext, { nonNullable: true }), value: new FormControl<string>("") });

  private _change: ChangeFn = () => { };
  private _touched: TouchedFn = () => { };

  protected onSubmit() {
    this._touched();
    const { context = this._defaultContext, value = null } = this.fg.value;
    this.emitSearchValue(context, value);
  }

  protected emitSearchValue(context: SearchContext, value: Nullable<string>) {
    this._change({ [context]: value } as { [key in SearchContext]: Nullable<string> });
  }

  public writeValue(value: Record<SearchContext, Nullable<string>> | null): void {
    const context = value ? Object.keys(value)[0] as SearchContext : null;
    this.fg.patchValue({
      context: context ?? this._defaultContext,
      value: context && value ? value[context] : ""
    });
  }

  public registerOnChange(fn: ChangeFn): void {
    this._change = fn;
  }

  public registerOnTouched(fn: TouchedFn): void {
    this._touched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled && this.fg.enabled) this.fg.disable()
    else if (!isDisabled && this.fg.disabled) this.fg.enable();
  }
}
