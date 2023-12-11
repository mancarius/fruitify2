import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Data } from '@angular/router';
import { PhotoStore } from '@shared/store';
import { provideComponentStore } from '@ngrx/component-store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Fruit, Nullable } from '@shared/types';
import { Observable, filter, map } from 'rxjs';

@Component({
  selector: 'app-fruit',
  standalone: true,
  imports: [CommonModule],
  providers: [provideComponentStore(PhotoStore)],
  templateUrl: './fruit.component.html',
  styleUrl: './fruit.component.scss'
})
export class FruitComponent {

  private _activatedRoute = inject(ActivatedRoute);
  private _photoStore = inject(PhotoStore);
  private _routeData$: Observable<Data | { fruit: Nullable<Fruit> }> = this._activatedRoute.data;
  private _fruit$: Observable<Nullable<Fruit>> = this._routeData$.pipe(
    filter((data) => 'fruit' in data),
    map((data) => data.fruit)
  );

  /* Public properties */
  fruit = toSignal(this._fruit$, { initialValue: null });
  photo = this._photoStore.photo;
  loading = this._photoStore.loading;


  ngOnInit() {
    this._photoStore.fetchPhoto(this._fruit$);
  }
}
