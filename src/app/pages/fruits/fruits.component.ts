import { Component, OnInit } from '@angular/core';
import { FruitsSearchComponent } from './components/fruits-search/fruits-search.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Fruit } from '../../shared/types';
import { FruitsStore } from './fruits.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-fruits',
  standalone: true,
  imports: [
    FruitsSearchComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideComponentStore(FruitsStore),
  ],
  templateUrl: './fruits.component.html',
})
export class FruitsComponent implements OnInit {
  protected searchControl = new FormControl();
  private _searchText$ = this.searchControl.valueChanges;

  public fruits = toSignal<Fruit[]>(this._fruitStore.fruits$);
  public loading = toSignal<boolean>(this._loadingService.isLoading$);

  constructor(
    private readonly _fruitStore: FruitsStore,
    private readonly _loadingService: LoadingService) { }

  ngOnInit() {
    this._fruitStore.fetchFruits();
    this._fruitStore.getFruitByName(this._searchText$);
  }
}
