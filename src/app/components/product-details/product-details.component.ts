import { CommonModule } from '@angular/common';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDetails } from '../../interfaces/product-details';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  showDescription : boolean = true;
  showPolicy : boolean = false;
  disableSeeMore : boolean = false;

  productData : any;
  currentProductImageSet : any;
  currentProductImage : any;
  selectedImageOption : string = "";
  selectedSizeOption : string = "Medium";

  reviews : any;
  reviewsDisplayed : any[] = [];
  reviewsPerPage = 5;
  currentPage = 1;
  averageRating : number = 0;
  ratingRoundedUp : number = 0;
  starIndex : Array<number> = [1, 2, 3, 4, 5];
  recommendations : any;

  constructor (private _productService : ProductService, private _router : Router) { }

  ngOnInit(): void {
    this._productService.getProduct(this._router.url).subscribe({
      next : productData => {
        this.productData = productData;
        this.getCurrentProductImageSet();
        this.reviews = productData.reviews;
        this.calculateAverageRating(productData);
        this.updateDisplayedReviews();
        this.checkMaxReviewsShow();
      }
    });

    this._productService.getAllProduct(this._router.url.split("/")[1]).subscribe({
      next : products => {
        this.recommendations = products.slice(0, 4);
      }
    })
  }

  getCurrentProductImageSet(index : number = 0) : void
  {
    this.currentProductImageSet = this.productData['images by colors'][index];
    this.getCurrentProductImage();
  }

  getCurrentProductImage(index : number = 1) : void
  {
    this.currentProductImage = this.currentProductImageSet['image urls'][index];
    this.selectedImageOption = `button ${index}`;
  }

  sizeSelected(size : string)
  {
    this.selectedSizeOption = size;
  }

  toggleDescription() : void
  {
    this.showDescription = true;
    this.showPolicy = false;
  }

  togglePolicy() : void
  {
    this.showDescription= false;
    this.showPolicy = true;
  }

  calculateAverageRating(product : ProductDetails) : void
  {
    let totalRating : number = 0;
    for (let review of product.reviews)
    {
      totalRating += review.rating;
    }
    this.averageRating = Math.round((totalRating / product.reviews.length) * 2) / 2;
    this.ratingRoundedUp = Math.ceil(this.averageRating);
  }

  updateDisplayedReviews() : void
  {
    const start = 0;
    const end = this.currentPage * this.reviewsPerPage;
    this.reviewsDisplayed = this.reviews.slice(start, end);
  }

  checkMaxReviewsShow() : void
  {
    if (this.currentPage >= Math.ceil(this.reviews.length / this.reviewsPerPage))
      {
        this.disableSeeMore = true;
      }
      else
      {
        this.disableSeeMore = false;
      }
  }

  onSeeMore() : void
  {
    this.currentPage++;
    this.updateDisplayedReviews();

    this.checkMaxReviewsShow();
  }
}
