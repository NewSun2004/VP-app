export interface CartLine {
  _id? : string;
  cart_id : string;
  has_customized : boolean;
  product_id? : string;
  for_customize_id? : string;
  quantity : number;
}
