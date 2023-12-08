import { Component, EffectRef, Injector, OnInit, Signal, effect, inject } from '@angular/core';
import { FruitsSearchComponent } from './components/fruits-search/fruits-search.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Fruit } from '../../shared/types';
import { FruitsStore } from './store/fruits.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { provideComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';

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
  private readonly _fruitStore = inject(FruitsStore);
  private readonly _loadingService = inject(LoadingService);
  private readonly _router = inject(Router);
  private readonly _injector = inject(Injector);

  protected searchControl = new FormControl("");
  private _searchText = toSignal(this.searchControl.valueChanges, { initialValue: "" });

  public fruits = toSignal<Fruit[]>(this._fruitStore.fruits$);
  public loading = toSignal<boolean>(this._loadingService.isLoading$);

  ngOnInit() {
    this._fruitStore.fetchFruits();

    this._search(this._searchText);
  }

  /**
   * Performs a search based on the provided text and navigates to the fruits page with the search query as a query parameter.
   * @param text - The search text.
   * @returns An EffectRef object representing the search effect.
   */
  private _search(text: Signal<string|null>): EffectRef {
    return effect(() => {
      this._router.navigate(['/fruits'], { queryParams: { name: text() } });
    }, { injector: this._injector });
  }
}
