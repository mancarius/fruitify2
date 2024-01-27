import { ChangeDetectionStrategy, Component, Input, Signal, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Fruit, MediaPhoto, MediaSize, Nullable } from '@shared/types';
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
        <span class="p-2 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 dark:text-white whitespace-nowrap">{{ fruit()?.name }}</span>
      </div>
    </div>
  `,

  styles: `
    :host {
      position: relative;
      padding: 1rem;
      overflow: hidden;
      container-type: inline-size;
    }

    .fruit-preview__photo {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      transition: transform 0.3s ease-in-out;
    }

    :host:hover .fruit-preview__photo {
      transform: scale(1.2);
    }

    .fruit-preview__name {
      font-size: 1.5rem;
      font-size: 15cqw;
      font-weight: bold;
      text-align: center;
      position: relative;
      z-index: 1;
    }
  `
})
export class FruitPreviewComponent {
  private _photoStore = inject(PhotoStore);

  @Input({ alias: 'fruit', required: true })
  set _fruits(fruit: Fruit) {
    this.fruit.set(fruit);
    this._photoStore.fetchPhoto({ fruit, options: { size: MediaSize.SMALL } });
  }

  protected fruit: WritableSignal<Nullable<Fruit>> = signal(null);
  protected photo: Signal<Nullable<MediaPhoto>> = this._photoStore.photo;
}
