import { Component } from '@angular/core';
import { DisplayProductsComponent } from "./components/display-products/display-products.component";
import { ProductDetailsComponent } from "./components/product-details/product-details.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VP-app';
}
