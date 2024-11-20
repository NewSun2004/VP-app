import { CartLine } from './../../interfaces/cart-line';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductDetails } from '../../interfaces/product-details';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{
  cartLines : CartLine[] = [];
  cartProducts : ProductDetails[] = [];
  totalPrice : number = 0;
  totalOrder : number = 0;

  constructor(private _authService : AuthService, private _productService : ProductService, private _cartService : CartService)
  { }

  ngOnInit() : void {
    this._authService.checkSession().subscribe({
      next : state => {
        if (state)
        {
          this._cartService.getCartLines(this._authService.currentUser.user.cart).subscribe({
            next : cartLines => {
              this.cartLines = cartLines
              for (let cartLine of this.cartLines)
              {
                this._productService.getProduct(cartLine.product_id!).subscribe({
                  next : productData => {
                    this.cartProducts.push(productData);
                  }
                })
              }
            }
          })
        }
      }
    })
  }

  plusQuantity(product : any) : void
  {

  }

  delete(cartLineId : string) : void
  {
    let cartLine = this.cartLines.find(cartLine => cartLine._id == cartLineId);
    this.cartLines = this.cartLines.filter(cartLine => cartLine._id != cartLineId);
    this.cartProducts = this.cartProducts.filter(product => product._id != cartLine?.product_id!);
    this._cartService.removeCartLine(cartLineId).subscribe({});
  }
}
