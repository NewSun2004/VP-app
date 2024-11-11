import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-display-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './display-products.component.html',
  styleUrl: './display-products.component.css'
})
export class DisplayProductsComponent implements OnInit{
  products : any;

  constructor(private _productService : ProductService) { }

  ngOnInit(): void {
    this._productService.getAllProduct().subscribe({
      next : allProductData => this.products = allProductData
    })
  }

}