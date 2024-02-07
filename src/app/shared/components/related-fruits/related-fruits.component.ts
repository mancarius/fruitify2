import { Component, ContentChild, Directive, Input, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedFruitsStore } from './related-fruits.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Fruit, Nullable } from '@shared/types';
import { provideComponentStore } from '@ngrx/component-store';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';



@Directive({
  selector: '[appRelatedFruitsContent]',
  standalone: true
})
export class RelatedFruitsContentDirective {
  readonly templateRef = inject(TemplateRef);
}



@Component({
  selector: 'app-related-fruits',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  providers: [provideComponentStore(RelatedFruitsStore)],
  host: {
    class: 'flex flex-col gap-4'
  },
  template: `
    @if (!loading()) {
      <ng-container [ngTemplateOutlet]="content.templateRef" [ngTemplateOutletContext]="{ $implicit: fruits() }"></ng-container>
    } @else {
      <p class="text-slate-400 dark:text-slate-500 center">Loading...</p>
    }

    @if (showLoadMoreBtn()){
      <div class="flex justify-center">
        <a mat-button class="text-slate-900 dark:text-slate-200" (click)="showAll()">Load more</a>
      </div>
    }
  `
})
export class RelatedFruitsComponent {
  private readonly _cs = inject(RelatedFruitsStore);

  @ContentChild(RelatedFruitsContentDirective) content!: RelatedFruitsContentDirective;

  @Input({ required: true })
  set fruit(value: Nullable<Fruit>) { this._cs.setFruit(value); }

  @Input()
  set maxSuggestions(value: number | undefined) { typeof value === "number" && this._cs.setMaxSuggestions(value); }

  loading = toSignal(this._cs.select(state => state.loading));

  fruits = toSignal(this._cs.fruits$);

  showLoadMoreBtn = toSignal(this._cs.select(state => state.maxSuggestions < state.fruits.length));

  readonly showAll = this._cs.showAll;
}