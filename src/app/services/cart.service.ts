import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../interfaces/cart';
import { CartLine } from '../interfaces/cart-line';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  myAPIUrl: string = 'http://localhost:3001';

  constructor(private _httpClient : HttpClient) { }

  getCart(userId : string) : Observable<Cart>
  {
    return this._httpClient.get<Cart>(this.myAPIUrl + `/cart/${userId}`);
  }

  getCartLines(cartId : string) : Observable<CartLine[]>
  {
    return this._httpClient.get<CartLine[]>(this.myAPIUrl + `/cart/cart_lines/${cartId}`);
  }

  insertCartLine(cartLine : CartLine) : Observable<CartLine>
  {
    return this._httpClient.post<CartLine>(this.myAPIUrl + "/cart/cart_line/add", cartLine);
  }

  removeCartLine(cartLineId : string) : Observable<any>
  {
    return this._httpClient.delete<any>(this.myAPIUrl + `/cart/cart_line/delete/${cartLineId}`);
  }
}
