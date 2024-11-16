import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-display-search-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './display-search-product.component.html',
  styleUrl: './display-search-product.component.css'
})
export class DisplaySearchProductComponent {
  products : any;
  displayedProducts: any[] = [];
  productsPerPage = 15;
  currentPage = 1;
}
