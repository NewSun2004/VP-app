import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductDetails } from '../../interfaces/product-details';

@Component({
  selector: 'app-display-search-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './display-search-product.component.html',
  styleUrl: './display-search-product.component.css'
})
export class DisplaySearchProductComponent implements OnChanges{
  @Input() products : ProductDetails[] = [];

  displayedProducts: ProductDetails[] = [];
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

  getCategoryRoute(categoryName: string): string
  {
    const categoryMap: { [key: string]: string } = {
      "eye glasses": "/eyeglasses",
      "sun glasses": "/sunglasses"
    };

    return categoryMap[categoryName.toLowerCase()] || '/default-category';
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
