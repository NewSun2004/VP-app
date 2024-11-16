import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  myAPIUrl: string = 'http://localhost:3000/product';

  products: any[] = [];
  productsSubject = new BehaviorSubject<any[]>([]);

  constructor(private _httpClient: HttpClient) {}

  // Phương thức lấy tất cả sản phẩm, với tham số truy vấn tùy chọn
  getAllProducts(queryParams?: any): Observable<any[]> {
    let queryString: string = '';
    if (queryParams) {
      queryString = new URLSearchParams(queryParams).toString();
    }

    return this._httpClient
      .get<any[]>(`${this.myAPIUrl}${queryString ? '?' + queryString : ''}`)
      .pipe(
        tap((allProducts: any[]) => {
          this.products = allProducts;
          this.productsSubject.next(allProducts);
        })
      );
  }

  // Phương thức lấy sản phẩm best-seller
  getBestSellingProducts(): Observable<any[]> {
    return this._httpClient.get<any[]>(`${this.myAPIUrl}/best-selling`).pipe(
      tap((bestSellingProducts: any[]) => {
        this.productsSubject.next(bestSellingProducts);
      })
    );
  }

  // Phương thức lấy chi tiết sản phẩm theo ID
  getProduct(productId: string): Observable<any> {
    return this._httpClient.get<any>(`${this.myAPIUrl}/${productId}`);
  }
}
