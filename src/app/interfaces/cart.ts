import { CartLine } from "./cart-line";

export interface Cart {
  _id : string;
  user_id : string;
  cart_line : Array<CartLine>;
}
