import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { DisplaySearchProductComponent } from "../display-search-product/display-search-product.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DisplaySearchProductComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showNavBar : boolean = false;
  showSubMenuE : boolean = false;
  showSubMenuS : boolean = false;

  searchInput : string = "";
  products : any;

  constructor (private _productService : ProductService, private _router : Router) {}

  search()
  {
    this._productService.searchAllProduct(this.searchInput).subscribe({
      next : searchedProduct => {
        this.products = searchedProduct;
      }
    });
  }
}
