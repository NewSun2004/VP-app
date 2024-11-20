export interface CartLine {
  _id? : string;
  cart_id : string;
  has_customized : boolean;
  product_id? : string;
  selected_color_index : number;
  for_customize_id? : string;
  quantity : number;
}
