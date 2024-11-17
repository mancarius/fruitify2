import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Fruit, Nullable } from '@shared/types';
import { MatCardModule } from '@angular/material/card';
import { FruitNutritionsComponent } from '../fruit-nutritions/fruit-nutritions.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fruit-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatListModule, MatCardModule, FruitNutritionsComponent],
  template: `
    @if(fruit) {
      <h3 class="font-bold text-sm text-black dark:text-white m-0">Classification</h3>

      <mat-card class="w-full bg-white dark:bg-slate-50/10">
        <mat-nav-list role="list" class="w-full">
          <!-- Order -->
          <a mat-list-item role="listitem" [routerLink]="['/fruits']" [queryParams]="{ order: fruit.order }" class="w-full">
            <h3 matListItemTitle class="text-black dark:text-white">Order</h3>
            <p matListItemLine class="text-slate-900 dark:text-slate-200">{{fruit.order}}</p>
          </a>

          <!-- Genus -->
          <a mat-list-item role="listitem" [routerLink]="['/fruits']" [queryParams]="{ genus: fruit.genus }" class="w-full">
            <h3 matListItemTitle class="text-black dark:text-white">Genus</h3>
            <p matListItemLine class="text-slate-900 dark:text-slate-200">{{fruit.genus}}</p>
          </a>

          <!-- Family -->
          <a mat-list-item role="listitem" [routerLink]="['/fruits']" [queryParams]="{ family: fruit.family }" class="w-full">
            <h3 matListItemTitle class="text-black dark:text-white">Family</h3>
            <p matListItemLine class="text-slate-900 dark:text-slate-200">{{fruit.family}}</p>
          </a>
        </mat-nav-list>
      </mat-card>

      <h3 class="font-bold text-sm text-black dark:text-white m-0">Nutritions</h3>

      <mat-card class="w-full bg-white dark:bg-slate-50/10">
        <mat-card-content>
          <app-fruit-nutritions [nutritions]="fruit.nutritions"></app-fruit-nutritions>
        </mat-card-content>
      </mat-card>
    }
    @else {
      <p>Nothing to show</p>
    }
  `,
})
export class FruitDetailComponent {
  @Input({ required: true })
  fruit!: Nullable<Fruit>;
}
