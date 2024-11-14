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
  filterClose : boolean = true;
  shapeExpand : boolean = false;
  materialExpand : boolean = false;
  genderExpand : boolean = false;

  shapes : string[] = ["Aviator", "Rectangle", "Cat-eye", "Round", "Square", "Geometric"];
  materials : string[] = ["Acetate", "Nylon", "Metal", "Mixed"];
  genders : string[] = ["Female", "Male"]

  products : any;

  constructor(private _productService : ProductService) { }

  ngOnInit(): void {
    this._productService.getAllProduct().subscribe({
      next : allProductData => this.products = allProductData
    })
  }

}
