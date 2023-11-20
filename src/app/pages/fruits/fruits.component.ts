import { Component, OnInit } from '@angular/core';
import { FruitsSearchComponent } from './components/fruits-search/fruits-search.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { untilDestroyed } from '../../shared/utils';

@Component({
  selector: 'app-fruits',
  standalone: true,
  imports: [
    FruitsSearchComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './fruits.component.html',
})
export class FruitsComponent implements OnInit {
  protected searchControl = new FormControl();
  private _untilDestroyed = untilDestroyed();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(this._untilDestroyed())
      .subscribe(value => this.onSearchValueChange(value));
  }

  protected onSearchValueChange(value: Event | string | null) {
    // if (value instanceof Event) {
    //   value = (value.target as HTMLInputElement).value;
    // }

    console.log('Search value:', value);
  }
}
