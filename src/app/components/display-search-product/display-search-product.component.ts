import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-display-search-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './display-search-product.component.html',
  styleUrl: './display-search-product.component.css'
})
export class DisplaySearchProductComponent implements OnChanges{
  @Input() products : any;

  displayedProducts: any[] = [];
  productsPerPage = 15;
  currentPage = 1;

  ngOnChanges() : void
  {
    this.searchForProducts();
  }

  searchForProducts()
  {
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts() : void
  {
    const start = 0;
    const end = this.currentPage * this.productsPerPage;

    if (this.products.length > this.productsPerPage)
    {
      this.displayedProducts = this.products.slice(start, end);
    }
    else
    {
      this.displayedProducts = this.products;
    }
  }

  onSeeMore() : void
  {
    this.currentPage++;
    this.updateDisplayedProducts();
  }
}
