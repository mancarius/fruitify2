import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, Signal, inject } from '@angular/core';
import { FruitsSearchComponent } from '@shared/components/fruits-search/fruits-search.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Fruit, Nullable, SearchContext } from '@shared/types';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LoadingService } from '@shared/services/loading/loading.service';
import { provideComponentStore } from '@ngrx/component-store';
import { FruitPreviewPlaceholderComponent } from '@shared/components/fruit-preview-placeholder/fruit-preview-placeholder.component';
import { FruitListComponent } from '@shared/components/fruit-list/fruit-list.component';
import { FruitPreviewComponent } from '@shared/components/fruit-preview/fruit-preview.component';
import { HomeStore } from './home.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FruitsSearchComponent,
    FormsModule,
    ReactiveFormsModule,
    FruitListComponent,
    FruitPreviewComponent,
    FruitPreviewPlaceholderComponent,
    RouterLink
  ],
  providers: [
    provideComponentStore(HomeStore),
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly _cs = inject(HomeStore);
  private readonly _loadingService = inject(LoadingService);
  private _destroy$ = inject(DestroyRef);

  protected searchControl = new FormControl<Record<SearchContext, Nullable<string>> | null>(null);
  private _queryParams$ = this.searchControl.valueChanges;

  public fruits: Signal<Fruit[]> = toSignal(this._cs.fruits$, { initialValue: [] });
  public loading: Signal<boolean> = toSignal(this._loadingService.loading$, { initialValue: false });

  ngOnInit() {
    this._cs.search(this._queryParams$);

    this._cs.queryParams$
      .pipe(takeUntilDestroyed(this._destroy$))
      .subscribe((queryParams) => {
        this.searchControl.patchValue(queryParams);
      });
  }
}
