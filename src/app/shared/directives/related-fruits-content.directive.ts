import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[appRelatedFruitsContent]',
  standalone: true
})
export class RelatedFruitsContentDirective {
  readonly templateRef = inject(TemplateRef);
}
