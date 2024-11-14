import { Component, OnInit } from '@angular/core';
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
  filterName : string = "";
  productName : string = "";

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
  displayedProducts: any[] = [];
  productsPerPage = 15;
  currentPage = 1;

  constructor(private _productService : ProductService, private _route : ActivatedRoute, private _router : Router) { }

  ngOnInit(): void {
    const rawRouteUrl = this._router.url;
    const routeBaseUrl = rawRouteUrl.split("?")[0].replace("/", "");

    if (rawRouteUrl.includes("Male"))
    {
      this.filterName = "Men's";
    }
    else if (rawRouteUrl.includes("Female"))
    {
      this.filterName = "Women's";
    }
    else
    {
      this.filterName = "All";
    }
    this.productName = routeBaseUrl.charAt(0).toUpperCase() + routeBaseUrl.slice(1);

    this._route.queryParams.subscribe(params => {
      Object.keys(params).forEach(paramKey => {
        const selectedFilters = params[paramKey];
        let filterType;

        switch (paramKey)
        {
          case "shape":
            filterType = this.shapes;
            break;
          case "material":
            filterType = this.materials;
            break;
          default:
            filterType = this.genders;
            break;
        }

        if (Array.isArray(selectedFilters))
        {
        selectedFilters.forEach(filterName => {
          const selectedFilter = filterType.find(filter => filter.name === filterName);
          if (selectedFilter)
            {
            selectedFilter.selected = true;
            }
          });
        }
        else if (selectedFilters)
        {
        const selectedFilter = filterType.find(filter => filter.name === selectedFilters);
        if (selectedFilter)
          {
          selectedFilter.selected = true;
          }
        }});
      });

    this._productService.getAllProduct().subscribe({
      next : allProductData => {
        this.products = allProductData;
        this.updateDisplayedProducts();
      }
    })
  }

  onChange()
  {
    let params = new HttpParams();

    this.shapes
      .filter(shape => shape.selected)
      .forEach(shape => {
        params = params.append("shape", shape.name);
      });

    this.materials
      .filter(material => material.selected)
      .forEach(material => {
        params = params.append("material", material.name);
      });

    this.genders
      .filter(gender => gender.selected)
      .forEach(gender => {
        params = params.append("gender", gender.name);
      });

    const queryParamsObj: { [key: string]: string[] | null} = {};
    params.keys().forEach(key => {
      queryParamsObj[key] = params.getAll(key);
    });

    this._router.navigate(["eyeglasses"], { queryParams: queryParamsObj });
  }

  updateDisplayedProducts()
  {
    const start = 0;
    const end = this.currentPage * this.productsPerPage;
    this.displayedProducts = this.products.slice(start, end);
  }

  onSeeMore()
  {
    this.currentPage++;
    this.updateDisplayedProducts();
  }
}
