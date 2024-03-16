import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items center justify-center h-full">
      <h1>404 - Not Found</h1>
    </div>
  `,
})
export class NotFoundComponent {

}
