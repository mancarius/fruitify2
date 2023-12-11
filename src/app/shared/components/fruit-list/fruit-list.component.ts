import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fruit } from '@shared/types';
import { FruitPreviewComponent } from '../fruit-preview/fruit-preview.component';
import { FruitPreviewPlaceholderComponent } from '@shared/components/fruit-preview-placeholder/fruit-preview-placeholder.component';

@Component({
  selector: 'app-fruit-list',
  standalone: true,
  imports: [CommonModule, FruitPreviewComponent, FruitPreviewPlaceholderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    @for (fruit of fruits(); track fruit.id) {
      @defer (on viewport) {
        <app-fruit-preview class="aspect-[3/2] flex justify-center items-center" [fruit]="fruit"></app-fruit-preview>
      } @placeholder {
        <app-fruit-preview-placeholder></app-fruit-preview-placeholder>
      }
    }
  `,

  styles: [
    `:host { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
      grid-gap: 1rem; 
    }`
  ]
})
export class FruitListComponent {
  @Input({ alias: `fruits`, required: true })
  set _fruits(value: Fruit[]) { this.fruits.set(value) }

  protected fruits = signal<Fruit[]>([]);
}
