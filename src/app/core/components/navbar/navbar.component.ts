import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeTogglerComponent } from '@shared/components/theme-toggler/theme-toggler.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [CommonModule, ThemeTogglerComponent, MatButtonModule, MatIconModule]
})
export class NavbarComponent {
  protected showMenu = false;

  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }
}
