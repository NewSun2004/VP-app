import { Routes } from '@angular/router';
import { DisplayProductsComponent } from './components/display-products/display-products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const routes: Routes = [
  {path : "eye_glasses", component : DisplayProductsComponent},
  {path : "eye_glasses/:productId", component : ProductDetailsComponent},
  {path : "", redirectTo : "eye_glasses", pathMatch : "full"},
];
