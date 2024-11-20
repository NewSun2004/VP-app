import { Routes } from '@angular/router';
import { DisplayProductsComponent } from './components/display-products/display-products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CustomizeComponent } from './components/customize/customize.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ContactComponent } from './components/contact/contact.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { AuthGuard } from './guards/auth.guard';
import { PaymentComponent } from './components/payment/payment.component';

export const routes: Routes = [
  {path : "", component : HomepageComponent},
  {path : "register", component: RegisterComponent},
  {path : "login", component: LoginComponent, canActivate : [AuthGuard]},
  {path : "aboutus", component : AboutUsComponent},
  {path : "eyeglasses", component : DisplayProductsComponent},
  {path : "eyeglasses/:productId", component : ProductDetailsComponent},
  {path : "sunglasses", component : DisplayProductsComponent},
  {path : "sunglasses/:productId", component : ProductDetailsComponent},
  {path : "customize", component : CustomizeComponent},
  {path : "accessories", component : DisplayProductsComponent},
  {path : "accessories/:productId", component : ProductDetailsComponent},
  {path : "contacts", component : ContactComponent},
  {path : "cart", component : ShoppingCartComponent, canActivate : [AuthGuard]},
  {path : "payment", component : PaymentComponent, canActivate : [AuthGuard]},
  {path : "**", component : PageNotFoundComponent},
];
