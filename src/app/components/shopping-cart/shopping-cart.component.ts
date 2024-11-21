import { CartLine } from './../../interfaces/cart-line';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductDetails } from '../../interfaces/product-details';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{
  cartLines : CartLine[] = [];
  cartProducts : ProductDetails[] = [];

  boxChecked : boolean[] = [];
  totalPriceElements : number[] = [];
  shippingFee : number = 5;
  totalPrice : number = 0;
  totalOrder : number = 0;

  constructor(private _authService : AuthService, private _productService : ProductService, private _cartService : CartService, private _router : Router)
  { }

  ngOnInit() : void {
    this._cartService.getCartLines(this._authService.currentUser.cart).subscribe({
      next : cartLines => {
        this.cartLines = cartLines;
        for (let cartLine of this.cartLines)
        {
          this._productService.getProduct(cartLine.product_id!).subscribe({
            next : productData => {
              this.cartProducts.push(productData);
              this.boxChecked.push(true);
              this.totalPriceElements.push(cartLine.quantity * productData.product_price);
              this.updateTotalPrice();
            }
          })
        }
      }
    })
  }

  checkProduct(i : number) : void
  {
    this.updateTotalPrice(undefined, true);
  }

  delete(cartLineId : string, i : number) : void
  {
    let cartLine = this.cartLines.find(cartLine => cartLine._id == cartLineId);
    this.cartLines = this.cartLines.filter(cartLine => cartLine._id != cartLineId);
    this.cartProducts = this.cartProducts.filter(product => product._id != cartLine?.product_id!);
    console.log(i);
    this.updateTotalPrice(i);
    this._cartService.removeCartLine(cartLineId).subscribe({});
  }

  updateTotalPrice(i? : number, temp? : boolean) : void
  {
    if (i != undefined)
    {
      this.totalPriceElements.splice(i, 1);
    }

    this.totalPrice = this.totalPriceElements.reduce((sum, element) => {
      return sum + element;
    }, 0);

    if ( temp == true)
    {
      let totalPriceTemp = 0;
      for (let i = 0; i < this.boxChecked.length; i++)
      {
        if (this.boxChecked[i])
        {
          totalPriceTemp += this.totalPriceElements[i];
        }
      }

      this.totalPrice = totalPriceTemp;
    }

    this.totalOrder = this.totalPrice + this.shippingFee;
  }

  processToOrder() : void
  {
    this._cartService.selectedCartLines = [];
    this._cartService.selectedCartProducts = [];

    for (let i = 0; i < this.boxChecked.length; i++)
    {
      if (this.boxChecked[i])
      {
        this._cartService.selectedCartLines.push(this.cartLines[i]);
        this._cartService.selectedCartProducts.push(this.cartProducts[i]);
      }
    }
    this._cartService.totalPrice = this.totalPrice;
    this._cartService.shippingFee = this.shippingFee;
    this._router.navigate(["/payment"]);
  }
}
