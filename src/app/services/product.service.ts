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


  getAllProduct(routeBaseUrl : string, queryParams? : any) : Observable<[]>
>>>>>>> ee7132edb0ab8114552f75dae013a161a2490bd9
  {
    // Default URL
    let queryString : string = ""; // Build the query string from params if provided
    if (queryParams)
    {
        queryString = new URLSearchParams(queryParams).toString();
    }


    return this._httpClient.get<[]>(this.myAPIUrl + `/${routeBaseUrl}` + `${queryString ? '?' + queryString : ''}`).pipe(
>>>>>>> ee7132edb0ab8114552f75dae013a161a2490bd9
     tap((allProducts : any) => {
      this.products = allProducts;
      this.productsSbuject.next(allProducts);
     })
    );
  }

  getProduct(routeFullUrl : string) : Observable<any>
  {
    return this._httpClient.get<[]>(this.myAPIUrl + routeFullUrl);
  }
}
