import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  myAPIUrl : string = "http://localhost:3000";

  products : any = [];
  productsSbuject = new BehaviorSubject([]);

  constructor(private _httpClient : HttpClient) { }

  getAllProduct() : Observable<[]>
  {
    return this._httpClient.get<[]>(this.myAPIUrl + "/eyeglasses").pipe(
     tap((allProducts : any) => {
      this.products = allProducts;
      this.productsSbuject.next(allProducts);
     })
    );
  }

  getProduct(productId : string) : Observable<any>
  {
    return this._httpClient.get<[]>(this.myAPIUrl + "/eyeglasses" + `/${productId}`);
  }
}
