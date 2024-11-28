import {
  Component,
  ContentChild,
  Directive,
  input,
  TemplateRef,
  inject,
  OnInit,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { RelatedFruitsStore } from "./related-fruits.store";
import { Fruit, Nullable } from "@shared/types";
import { MatButtonModule } from "@angular/material/button";
import { MAX_SUGGESTIONS_PREVIEW_OPTION } from "@tokens";

/**
 * Directive to be used as a template for the related fruits component
 *
 * @example
 * ```html
 * <app-related-fruits [...]>
 *  <ng-template appRelatedFruitsContent let-fruits>
 *    <some-component [fruits]="fruits"></some-component>
 *  </ng-template>
 * </app-related-fruits>
 * ```
 */
@Directive({
  selector: "[appRelatedFruitsContent]",
  standalone: true,
})
export class RelatedFruitsContentDirective {
  readonly templateRef = inject(TemplateRef);
}

@Component({
  selector: "app-related-fruits",
  standalone: true,
  imports: [NgTemplateOutlet, MatButtonModule],
  providers: [RelatedFruitsStore],
  host: {
    class: "flex flex-col gap-4",
  },
  template: `
    @if (!content) {
      <p class="text-slate-400 dark:text-slate-500 center" data-testid="no-content-provided-error-message">
        No content provided
      </p>
    } @else if (cs.loading()) {
      <p
        class="text-slate-400 dark:text-slate-500 center"
        data-testid="loading"
      >
        Loading...
      </p>
    } @else if (cs.error()) {
      <p
        class="text-red-400 dark:text-red-500 center"
        data-testid="error-message"
      >
        {{ cs.error() }}
      </p>
    } @else {
      <ng-container
        [ngTemplateOutlet]="content.templateRef"
        [ngTemplateOutletContext]="{ $implicit: cs.slicedFruits() }"
      ></ng-container>

      @if (cs.showLoadMoreBtn()) {
        <div class="flex justify-center" data-testid="btn-container">
          <a
            mat-button
            class="text-slate-900 dark:text-slate-200"
            (click)="cs.toggleShowAll()"
            aria-label="Load more fruits"
            >{{ cs.buttonText() }}</a
          >
        </div>
      }
    }
  `,
})
export class RelatedFruitsComponent implements OnInit {
  protected readonly cs = inject(RelatedFruitsStore);

  @ContentChild(RelatedFruitsContentDirective)
  readonly content!: RelatedFruitsContentDirective;

  readonly fruit = input.required<Nullable<Fruit>>();

  readonly maxSuggestions = input<number>(
    inject(MAX_SUGGESTIONS_PREVIEW_OPTION),
  );

  ngOnInit() {
    this.cs.fetchFruits(this.fruit);

    this.cs.setMaxSuggestion(this.maxSuggestions);
  }
}
