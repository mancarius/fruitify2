import { ChangeDetectionStrategy, Component, Input, Signal, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Fruit, MediaPhoto, Nullable } from '@shared/types';
import { PhotoStore } from '@shared/store';

@Component({
  selector: 'app-fruit-preview',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  providers: [PhotoStore],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <div class="fruit-preview">
      @if(photo()) {
        <div class="fruit-preview__photo">
          <img [ngSrc]="photo()?.url ?? ''" fill />
        </div>
      }
      <div class="fruit-preview__name">
        <span>{{ fruit()?.name }}</span>
      </div>
    </div>
  `,

  styles: `
    :host {
      position: relative;
      padding: 1rem;
    }

    .fruit-preview__photo {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
    }

    .fruit-preview__name {
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .fruit-preview__name span {
      background-color: rgba(255, 255, 255, 0.8);
      padding: 0.5rem;
    }
  `
})
export class FruitPreviewComponent {
  private _photoStore = inject(PhotoStore);

  @Input({ alias: 'fruit', required: true })
  set _fruits(fruit: Fruit) {
    this.fruit.set(fruit);
    this._photoStore.fetchPhoto(fruit);
  }

  protected fruit: WritableSignal<Nullable<Fruit>> = signal(null);
  protected photo: Signal<Nullable<MediaPhoto>> = this._photoStore.photo;
}
