import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FruitStore } from './fruit.store';
import { provideComponentStore } from '@ngrx/component-store';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Fruit } from '@shared/types';

@Component({
  selector: 'app-fruit',
  standalone: true,
  imports: [CommonModule],
  providers: [provideComponentStore(FruitStore)],
  templateUrl: './fruit.component.html',
  styleUrl: './fruit.component.scss'
})
export class FruitComponent implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _cs = inject(FruitStore);

  protected fruit = toSignal(this._cs.fruit$);
  protected photo = toSignal(this._cs.photo$);
  protected loading = toSignal(this._cs.loading$);

  ngOnInit() {
    this._cs.setFruit(this._activatedRoute.data.pipe(
      map((data) => data['fruit'] as Fruit | null)
    ));
  }
}
