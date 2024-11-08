import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  myAPIUrl : string = "http://localhost:3000"

  constructor(private _httpClient : HttpClient) { }

  getAllProduct() : Observable<[]>
  {
    return this._httpClient.get<[]>(this.myAPIUrl + "/eye_glasses");
  }
}
