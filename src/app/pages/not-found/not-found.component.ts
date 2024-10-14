import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center gap-4 h-full grow">
      <h1 class="text-slate-500 font-bold text-6xl">404 - Not Found</h1>
      <p>It seems like you are lost. Please, <a href="/" class="hover:underline">go back to the safe zone</a>.</p>
    </div>
  `,
})
export class NotFoundComponent {

}
