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
  productsSubject = new BehaviorSubject<ProductDetails[]>([]);

  bestSellingProducts: ProductDetails[] = [];
  bestSellingProductsSubject = new BehaviorSubject<ProductDetails[]>([]);

  constructor(private _httpClient: HttpClient) {}

  // Tìm kiếm tất cả sản phẩm theo từ khóa
  searchAllProduct(searchTerm: string): Observable<ProductDetails[]> {
    return this._httpClient.get<ProductDetails[]>(
      this.myAPIUrl + '/search' + `/${searchTerm}`
    );
  }

  // Lấy tất cả sản phẩm (kèm query nếu cần)
  getAllProduct(
    routeBaseUrl: string,
    queryParams?: any
  ): Observable<ProductDetails[]> {
    let queryString: string = '';
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
          this.productsSubject.next(allProducts);
        })
      );
  }

  // Lấy chi tiết một sản phẩm theo ID
  getProduct(productId: string): Observable<ProductDetails> {
    return this._httpClient.get<ProductDetails>(
      this.myAPIUrl + `/product/${productId}`
    );
  }

  // Lấy tất cả đánh giá của sản phẩm
  getAllReviews(productId: string): Observable<Review[]> {
    return this._httpClient.get<Review[]>(
      this.myAPIUrl + `/reviews/${productId}`
    );
  }

  // Lấy danh sách sản phẩm Best-Selling
  getBestSellingProducts(category?: string): Observable<ProductDetails[]> {
    const url = category
      ? `${this.myAPIUrl}/bestseller/best-selling/${category}`
      : `${this.myAPIUrl}/bestseller/best-selling`;

    return this._httpClient.get<ProductDetails[]>(url).pipe(
      tap((bestSelling: any) => {
        this.bestSellingProducts = bestSelling;
        this.bestSellingProductsSubject.next(bestSelling);
      })
    );
  }
}
