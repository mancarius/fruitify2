import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-fruit-preview-placeholder',
    imports: [MatProgressSpinnerModule],
    host: {
        class: 'flex justify-center items-center bg-gray-500/10',
    },
    template: `<mat-spinner diameter="30" color="primary"></mat-spinner>`
})
export class FruitPreviewPlaceholderComponent { }
