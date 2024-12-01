import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    imports: [NgFor],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'relative bg-gray-300 dark:bg-gray-700 pt-8 pb-6'
    },
    template: `
    <div class="bg-gray-100 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center md:justify-between justify-center">
          <div class="w-full px-4 mx-auto">
            <p class="text-sm text-gray-600 dark:text-gray-400 font-semibold py-1 text-center m-0">
              © {{ date }} Mattia Mancarella
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FooterComponent {
  readonly date = new Date().getFullYear();

  readonly links = [
    {
      name: 'About Me',
      url: 'https://www.mattiamancarella.com'
    },
    {
      name: 'Github',
      url: 'https://www.github.com/mancarius'
    },
    {
      name: 'Contact Me',
      url: 'https://www.mattiamancarella.com/#contacts'
    }
  ];
}
