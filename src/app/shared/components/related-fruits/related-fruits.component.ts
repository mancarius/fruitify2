import { Component, ContentChild, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedFruitsStore } from './related-fruits.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { RelatedFruitsContentDirective } from '@shared/directives/related-fruits-content.directive';
import { Fruit, Nullable } from '@shared/types';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-related-fruits',
  standalone: true,
  imports: [CommonModule],
  providers: [provideComponentStore(RelatedFruitsStore)],
  template: `
    <ng-container [ngTemplateOutlet]="content.templateRef" [ngTemplateOutletContext]="{ $implicit: fruits() }"></ng-container>
  `
})
export class RelatedFruitsComponent {
  private readonly _cs = inject(RelatedFruitsStore);

  @ContentChild(RelatedFruitsContentDirective) content!: RelatedFruitsContentDirective;

  @Input({ required: true })
  set fruit(value: Nullable<Fruit>) { this._cs.setFruit(value); }

  @Input()
  set maxSuggestions(value: number) { this._cs.setMaxSuggestions(value); }

  fruits = toSignal(this._cs.fruits$);
}
