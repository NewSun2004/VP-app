export interface ProductDetails {
  _id : string;
  product_name : string;
  product_description : string;
  product_price : number;
  product_gender : string;
  customizable : boolean;
  product_material : string;
  category_name : string;
  product_shape : string;
  product_lines : Array<Line>;
  stock : number;
  reviews : Array<string>;
}

interface Line {
  product_line_name : string;
  image_urls : Array<string>;
  image_paths : Array<string>;
}
