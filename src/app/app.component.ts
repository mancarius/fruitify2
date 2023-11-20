import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinimalHorizontalLayoutComponent } from './shared/layouts/minimalist-horizontal-layout/minimal-horizontal-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MinimalHorizontalLayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fruitify';
}
