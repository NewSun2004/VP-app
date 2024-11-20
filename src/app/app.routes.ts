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
import { VerifyComponent } from './components/verify/verify.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyForgotComponent } from './components/verify-forgot/verify-forgot.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  {path : "", component : HomepageComponent},
  {path :"register", component: RegisterComponent},
  {path :"verify", component: VerifyComponent},
  {path : "login", component: LoginComponent},
  {path : "forgot-password", component: ForgotPasswordComponent},
  {path : "verify-forgot", component:VerifyForgotComponent},
  {path : "verify-forgot/reset-password", component: ResetPasswordComponent},
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
