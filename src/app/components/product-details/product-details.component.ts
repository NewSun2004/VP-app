import { CommonModule } from '@angular/common';
import { ProductService } from './../../services/product.service';
import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  productId = input.required<string>();

  product : any;
  reviews_count : number = 0;

  constructor (private _productService : ProductService) { }

  ngOnInit(): void {
    this._productService.getProduct(this.productId()).subscribe({
      next : productData => {
        this.product = productData
        this.reviews_count = productData["reviews"].length
      }
    })
  }
}
