import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [CommonModule]
})
export class NavbarComponent {
  protected showMenu = false;

  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }
}
