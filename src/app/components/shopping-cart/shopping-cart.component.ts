import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductDetails } from '../../interfaces/product-details';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{
  cartProducts : {
    product : ProductDetails,
    product_line_index : number
  }[] = [];

  constructor(private _productService : ProductService) {}

  ngOnInit() : void {
    this._productService.cartProducts.subscribe({
      next : cartProducts => {
        this.cartProducts = cartProducts;
        console.log(this.cartProducts);
      }
    })

  }
}
