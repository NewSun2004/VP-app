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
  rawRouteUrl : string = "";
  routeBaseUrl : string = "";

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
    this.rawRouteUrl = this._router.url;
    this.routeBaseUrl = this.rawRouteUrl.split("?")[0].replace("/", "");

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

        this._productService.getAllProduct(this.routeBaseUrl, params).subscribe({
          next : allProductData => {
            this.products = allProductData;
            this.updateDisplayedProducts();
            this.updateFilterName();
          }
        });
      }
    );
  }

  updateFilterName() : void
  {
    this.rawRouteUrl = this._router.url;

    if (this.rawRouteUrl.includes("Male") && !this.rawRouteUrl.includes("Female"))
    {
      this.filterName = "Men's";
    }
    else if (this.rawRouteUrl.includes("Female") && !this.rawRouteUrl.includes("Male"))
    {
      this.filterName = "Women's";
    }
    else
    {
      this.filterName = "All";
    }
    this.productName = this.routeBaseUrl.charAt(0).toUpperCase() + this.routeBaseUrl.slice(1);
  }

  onChange() : void
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

    this._router.navigate([this.routeBaseUrl], { queryParams: queryParamsObj });
  }

  updateDisplayedProducts() : void
  {
    const start = 0;
    const end = this.currentPage * this.productsPerPage;
    this.displayedProducts = this.products.slice(start, end);
  }

  onSeeMore() : void
  {
    this.currentPage++;
    this.updateDisplayedProducts();
  }
}
