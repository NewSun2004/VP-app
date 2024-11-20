import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProductDetails } from '../interfaces/product-details';
import { Review } from '../interfaces/review';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  myAPIUrl: string = 'http://localhost:3001';

  products: ProductDetails[] = [];
  productsSbuject = new BehaviorSubject<ProductDetails[]>([]);

  bestSellingProducts: any[] = [];
  bestSellingProductsSubject = new BehaviorSubject<any[]>([]);

  constructor(private _httpClient: HttpClient) {}

  searchAllProduct(searchTerm : string) : Observable<ProductDetails[]>
  {
    return this._httpClient.get<ProductDetails[]>(this.myAPIUrl + "/search" + `/${searchTerm}`);
  }

  getAllProduct(routeBaseUrl : string, queryParams? : any) : Observable<ProductDetails[]>
  {
    // Default URL
    let queryString: string = ''; // Build the query string from params if provided
    if (queryParams) {
      queryString = new URLSearchParams(queryParams).toString();
    }

    return this._httpClient
      .get<ProductDetails[]>(
        this.myAPIUrl +
          `/${routeBaseUrl}` +
          `${queryString ? '?' + queryString : ''}`
      )
      .pipe(
        tap((allProducts: any) => {
          this.products = allProducts;
          this.productsSbuject.next(allProducts);
        })
      );
  }

  getProduct(productId : string): Observable<ProductDetails>
  {
    return this._httpClient.get<ProductDetails>(this.myAPIUrl + `/product/${productId}`);
  }

  // Phương thức lấy sản phẩm best-seller
  getBestSellingProducts(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this.myAPIUrl}/best-selling`).pipe(
      tap((bestSellingProducts: any[]) => {
        this.bestSellingProductsSubject.next(bestSellingProducts);
      })
    );
  }

  getAllReviews(productId : string) : Observable<Review[]>
  {
    return this._httpClient.get<Review[]>(this.myAPIUrl + `/reviews/${productId}`)
  }
}
