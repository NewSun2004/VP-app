import { Component, input, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-display-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './display-products.component.html',
  styleUrl: './display-products.component.css'
})
export class DisplayProductsComponent implements OnInit{
  filterClose : boolean = true;
  shapeExpand : boolean = false;
  materialExpand : boolean = false;
  genderExpand : boolean = false;

  queryParams : string = "";

  shapes : any[] = [
    {name : "Aviator", selected : false},
    {name : "Rectangle", selected : false},
    {name : "Cat-eye", selected : false},
    {name : "Round", selected : false},
    {name : "Square", selected : false},
    {name : "Geometric", selected : false}
  ];
  materials : any[] = [
    {name : "Acetate", selected : false},
    {name : "Nylon", selected : false},
    {name : "Metal", selected : false},
    {name : "Mixed", selected : false}
  ];
  genders : any[] = [
    {name : "Female", selected : false},
    {name : "Male", selected : false}
  ]

  products : any;
  selectedFilters : string[] = [];

  constructor(private _productService : ProductService, private _route : ActivatedRoute, private _router : Router) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      const selectedShapes = params['shapes'];

      if (Array.isArray(selectedShapes)) {
        selectedShapes.forEach(shapeName => {
          const shape = this.shapes.find(shape => shape.name === shapeName);
          if (shape) {
            shape.selected = true;
          }
        });
      } else if (selectedShapes) {
        const shape = this.shapes.find(shape => shape.name === selectedShapes);
        if (shape) {
          shape.selected = true;
        }
      }
    });

    this._productService.getAllProduct().subscribe({
      next : allProductData => this.products = allProductData
    })
  }

  onChange()
  {
    let params = new HttpParams();

    this.shapes
      .filter(shape => shape.selected)
      .forEach(shape => {
        params = params.append('shapes', shape.name);
      });

    const queryParamsObj: { [key: string]: string[] | null} = {};
    params.keys().forEach(key => {
      queryParamsObj[key] = params.getAll(key);
    });

    this._router.navigate(['/eyeglasses'], { queryParams: queryParamsObj });
  }
}
