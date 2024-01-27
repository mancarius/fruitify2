import { AfterViewInit, Component, Injector, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Data } from '@angular/router';
import { PhotoStore } from '@shared/store';
import { provideComponentStore } from '@ngrx/component-store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Fruit, MediaPhoto, Nullable } from '@shared/types';
import { Observable, filter, map } from 'rxjs';
import { FruitPreviewComponent } from '@shared/components/fruit-preview/fruit-preview.component';
import { FruitDetailComponent } from './components/fruit-detail/fruit-detail.component';
import { RelatedFruitsComponent } from '@shared/components/related-fruits/related-fruits.component';
import { RelatedFruitsContentDirective } from '@shared/directives/related-fruits-content.directive';
import { FruitListComponent } from '@shared/components/fruit-list/fruit-list.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-fruit',
  standalone: true,
  imports: [CommonModule, FruitPreviewComponent, FruitDetailComponent, RelatedFruitsComponent, RelatedFruitsContentDirective, FruitListComponent, MatCardModule],
  providers: [provideComponentStore(PhotoStore)],
  templateUrl: './fruit.component.html',
  styleUrl: './fruit.component.scss',
  host: {
    class: 'w-full min-h-screen flex flex-col justify-center items-center relative'
  },
})
export class FruitComponent implements AfterViewInit {
  private _injector = inject(Injector);

  private _activatedRoute = inject(ActivatedRoute);

  private _routeData$: Observable<Data | { fruit: Nullable<Fruit>, photo: Nullable<MediaPhoto> }> = this._activatedRoute.data;

  private _fruit$: Observable<NonNullable<Fruit>> = this._routeData$.pipe(
    filter((data) => 'fruit' in data),
    map((data) => data.fruit)
  );

  private _photo$: Observable<MediaPhoto> = this._routeData$.pipe(
    filter((data) => 'photo' in data),
    map((data) => data.photo)
  );

  private _photo = toSignal(this._photo$, { initialValue: null });
  
  /* Public properties */
  fruit = toSignal(this._fruit$, { initialValue: null });

  headerBackgroundImage = computed(() => `url(${this._photo()?.url})`);

  ngAfterViewInit(): void {
    effect(() => {
      this.fruit();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, { injector: this._injector });
  }
}
