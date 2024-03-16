import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { Fruit } from '@shared/types';
import { FruitPreviewStore } from './fruit-preview.store';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-fruit-preview',
  standalone: true,
  imports: [NgIf, NgOptimizedImage],
  providers: [provideComponentStore(FruitPreviewStore)],
  changeDetection: ChangeDetectionStrategy.OnPush,

  host: {
    class: 'bg-gray-500/10 relative overflow-hidden p-4',
  },

  template: `
    <div *ngIf="vm() as vm" class="fruit-preview">

      @if(vm.imgUrl) {
        <div class="fruit-preview__photo">
          <img [ngSrc]="vm.imgUrl" [alt]="vm.imgAlt" fill />
        </div>
      }

      <div class="fruit-preview__name">
        <span class="block leading-[1em] p-2 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 dark:text-white">{{ vm.fruitName }}</span>
      </div>

    </div>
  `,

  styles: `
    :host {
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

      span {
        width: min-content;
      }
    }
  `
})
export class FruitPreviewComponent {
  private readonly _cs = inject(FruitPreviewStore);

  @Input({ required: true })
  set fruit(fruit: Fruit) {
    this._cs.setFruit(fruit);
  }

  protected vm = this._cs.vm;
}
