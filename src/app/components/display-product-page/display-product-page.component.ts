import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display-product-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-product-page.component.html',
  styleUrl: './display-product-page.component.css'
})
export class DisplayProductPageComponent implements OnInit{
  products : any;

  constructor(private _productService : ProductService) { }

  ngOnInit(): void {
    this._productService.getAllProduct().subscribe({
      next : allProductData => this.products = allProductData
    })
  }

}
