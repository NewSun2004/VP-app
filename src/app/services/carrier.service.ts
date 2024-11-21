import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrierService {
  myAPIUrl: string = 'http://localhost:3001';

  carriers : any[] = [];

  constructor(private _httpClient : HttpClient) {}

  getCarrier() : Observable<any[]>
  {
    return this._httpClient.get<any[]>(this.myAPIUrl + "/carrier/get").pipe(
      tap((carriers) => {
        this.carriers = carriers;
      })
    );
  }
}
