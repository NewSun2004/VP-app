import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProductDetails } from '../interfaces/product-details';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  myAPIUrl: string = 'http://localhost:3000';

  products: any = [];
  productsSbuject = new BehaviorSubject([]);

  constructor(private _httpClient: HttpClient) {}

  searchAllProduct(searchTerm : string) : Observable<[]>
  {
    return this._httpClient.get<[]>(this.myAPIUrl + "/search" + `/${searchTerm}`);
  }

  getAllProduct(routeBaseUrl : string, queryParams? : any) : Observable<[]>
  {
    // Default URL
    let queryString: string = ''; // Build the query string from params if provided
    if (queryParams) {
      queryString = new URLSearchParams(queryParams).toString();
    }

    return this._httpClient
      .get<[]>(
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

  getProduct(routeFullUrl: string): Observable<ProductDetails> {
    return this._httpClient.get<ProductDetails>(this.myAPIUrl + routeFullUrl);
  }
}
