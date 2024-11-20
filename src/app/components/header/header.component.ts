import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { DisplaySearchProductComponent } from "../display-search-product/display-search-product.component";
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DisplaySearchProductComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isLoggedIn : boolean = false;

  showNavBar : boolean = false;
  showSubMenuE : boolean = false;
  showSubMenuS : boolean = false;

  searchInput : string = "";
  cartCount : number = 0;
  products : any;

  constructor (private _authService : AuthService, private _productService : ProductService, private _cartService : CartService) {}

  ngOnInit(): void {
    this._authService.checkSession().subscribe({
      next : inSession => {
        this.isLoggedIn = inSession;
        this._cartService.getCartLines(this._authService.currentUser.cart).subscribe({
          next : cartLines => {
            this._cartService.currentItemsInCart = cartLines;
            this.cartCount = cartLines.length;
          }
        })
      }
    });
  }

  logOut() : void
  {
    this._authService.logout().subscribe({
      next : () => {}
    });
  }

  search()
  {
    this._productService.searchAllProduct(this.searchInput).subscribe({
      next : searchedProduct => {
        this.products = searchedProduct;
      }
    });
  }
}
