import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-fruit-preview-placeholder',
  standalone: true,
  imports: [MatProgressSpinnerModule],

  template: `<mat-spinner size="30" color="primary"></mat-spinner>`,

  styles: [`:host { display: flex; justify-content: center; align-items: center; }`],
})
export class FruitPreviewPlaceholderComponent { }
