import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  host: {
    class: 'relative bg-gray-300 pt-8 pb-6'
  }
})
export class FooterComponent {
  protected date = new Date().getFullYear();
}
