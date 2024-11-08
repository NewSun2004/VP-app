import { Component } from '@angular/core';
import { DisplayProductPageComponent } from "./components/display-product-page/display-product-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DisplayProductPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VP-app';
}
