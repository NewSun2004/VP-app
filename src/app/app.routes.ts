import { Routes } from '@angular/router';
import { DisplayProductsComponent } from './components/display-products/display-products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const routes: Routes = [
  {path : "products", component : DisplayProductsComponent},
  {path : "product/:id", component : ProductDetailsComponent},
  {path : "", redirectTo : "products", pathMatch : "full"},
];
