export interface ProductDetails {
  _id : string;
  name : string;
  description : string;
  price : number;
  category : string;
  gender : string;
  material : string;
  shape : string;
  ["images by colors"] : Array<ImagesByColor>;
  reviews : Array<Review>;
}

interface ImagesByColor {
  ["color description"] : string;
  ["image urls"] : Array<string>;
  ["image paths"] : Array<string>;
}

interface Review {
  username : string;
  title : string;
  rating : number;
  review : string;
  ["prescription type"] : string;
}
