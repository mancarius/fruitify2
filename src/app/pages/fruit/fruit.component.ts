import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Data } from '@angular/router';
import { FruitStore } from './fruit.store';
import { provideComponentStore } from '@ngrx/component-store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Fruit, Nullable } from '@shared/types';

@Component({
  selector: 'app-fruit',
  standalone: true,
  imports: [CommonModule],
  providers: [provideComponentStore(FruitStore)],
  templateUrl: './fruit.component.html',
  styleUrl: './fruit.component.scss'
})
export class FruitComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _cs = inject(FruitStore);
  private _routeData = toSignal<Data | { fruit: Nullable<Fruit> }>(this._activatedRoute.data);

  protected fruit = this._cs.fruit;
  protected photo = this._cs.photo;
  protected loading = this._cs.loading;

  constructor() {
    effect(() => this._cs.setFruit(this._routeData()?.fruit));
  }
}
