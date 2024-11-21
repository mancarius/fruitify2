import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center gap-4 h-full">
      <h1 class="text-slate-500 font-bold text-6xl">Error</h1>
      <p>It seems like something has gone terribly wrong. Please, try again later.</p>
    </div>
  `,
})
export class ErrorComponent { }
