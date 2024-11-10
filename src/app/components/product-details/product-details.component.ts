import { CommonModule } from '@angular/common';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  products : any;
  product : any;

  constructor (private _productService : ProductService) { }

  ngOnInit(): void {
    this._productService.getAllProduct().subscribe({
      next : allProductData => {
        this.products = allProductData;
        this.product = this.products[0];
        console.log(this.product);
      }
    })
  }
}
