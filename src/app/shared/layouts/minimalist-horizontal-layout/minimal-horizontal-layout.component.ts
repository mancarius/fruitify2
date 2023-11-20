import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-minimal-horizontal-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterOutlet],
  templateUrl: './minimal-horizontal-layout.component.html',
  styleUrl: './minimal-horizontal-layout.component.scss'
})
export class MinimalHorizontalLayoutComponent {}
