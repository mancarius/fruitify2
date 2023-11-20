import { Component, Input, Output, WritableSignal, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

type ChangeFn = (value: string | null) => void;
type TouchedFn = () => void;

@Component({
  selector: 'app-fruits-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
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
  protected value: string | null = null;
  protected disabled: WritableSignal<boolean> = signal(false);

  private _change: ChangeFn = () => { };
  private _touched: TouchedFn = () => { };

  protected onSubmit() {
    this._touched();
    this.emitSearchValue();
  }

  protected emitSearchValue(value: string | null = this.value) {
    this._change(this.value);
  }

  public writeValue(value: string | null): void {
    this.value = value;
  }

  public registerOnChange(fn: ChangeFn): void {
    this._change = fn;
  }

  public registerOnTouched(fn: TouchedFn): void {
    this._touched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
