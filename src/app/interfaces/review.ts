export interface Review {
  _id : string;
  product_id : string;
  username : string;
  title : string;
  rating : number;
  review_text : string;
  prescription_type : string;
  creation_datetime : Date;
}
