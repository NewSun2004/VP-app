import { Routes } from '@angular/router';
import { DisplayProductsComponent } from './components/display-products/display-products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const routes: Routes = [
  {path : "eyeglasses", component : DisplayProductsComponent},
  {path : "eyeglasses/:productId", component : ProductDetailsComponent},
  {path : "", redirectTo : "eyeglasses", pathMatch : "full"},
];
