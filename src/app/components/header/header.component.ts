import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { DisplaySearchProductComponent } from "../display-search-product/display-search-product.component";
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DisplaySearchProductComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  showNavBar: boolean = false;
  showSubMenuE: boolean = false;
  showSubMenuS: boolean = false;

  searchInput: string = "";
  cartCount: number = 0;
  products: any;

  constructor(private _authService: AuthService, private _productService: ProductService, private _cartService : CartService, private router: Router) {}

  ngOnInit(): void {
    this._authService.isLoggedIn.subscribe({
      next: (status) => {
        this.isLoggedIn = status;
        if (status)
        {
          this._cartService.currentItemsInCartSubject.asObservable().subscribe({
            next : cartLines => {
              this.cartCount = cartLines.length;
            }
          })
        }
      },
    });
  }

  logOut(): void {
    // Call logout method from AuthService
    this._authService.logout().subscribe({
      next: () => {
        // On successful logout, reset the UI and navigate to login page
        this.isLoggedIn = false;
        this.cartCount = 0; // Clear cart count or reset cart state if needed
        this.router.navigate(['/login']); // Redirect to login page after logout
      },
      error: (err) => {
        // Optionally handle errors, such as a failed logout
        console.error('Logout failed', err);
      },
    });
  }

  search(): void {
    this._productService.searchAllProduct(this.searchInput).subscribe({
      next: (searchedProduct) => {
        this.products = searchedProduct;
      },
    });
  }
}
