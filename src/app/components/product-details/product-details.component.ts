import { CommonModule } from '@angular/common';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDetails } from '../../interfaces/product-details';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  isLoggedIn : boolean = false;

  showDescription : boolean = true;
  showPolicy : boolean = false;
  disableSeeMore : boolean = false;

  productData : any;
  currentProductImageSet : any;
  currentProductImage : any;
  selectedQuantity : number = 1;
  selectedImageOption : string = "";
  currentProductLineIndex : number = 1;
  selectedSizeOption : string = "Medium";

  reviews : any;
  reviewsDisplayed : any[] = [];
  reviewsPerPage = 5;
  currentPage = 1;
  averageRating : number = 0;
  ratingRoundedUp : number = 0;
  starIndex : Array<number> = [1, 2, 3, 4, 5];
  recommendations : any;

  constructor (private _authService : AuthService, private _productService : ProductService, private _cartService : CartService, private _router : Router) { }

  ngOnInit(): void {
    this._authService.isLoggedIn().subscribe({
      next : inSession => {
        this.isLoggedIn = inSession;
      }
    })

    this._productService.getProduct(this._router.url.split("/")[2]).subscribe({
      next : productData => {
        this.productData = productData;
        this.getCurrentProductImageSet();
      }
    });

    this._productService.getAllReviews(this._router.url.split("/")[2]).subscribe({
      next : reviews => {
        this.reviews = reviews;
        this.calculateAverageRating(this.productData);
        this.updateDisplayedReviews();
        this.checkMaxReviewsShow();
      }
    })

    this._productService.getAllProduct(this._router.url.split("/")[1]).subscribe({
      next : products => {
        this.recommendations = products.slice(0, 4);
      }
    })
  }

  getCurrentProductImageSet(index : number = 0) : void
  {
    this.currentProductImageSet = this.productData.product_lines[index];
    this.currentProductLineIndex = index;
    this.getCurrentProductImage();
  }

  getCurrentProductImage(index : number = 1) : void
  {
    this.currentProductImage = this.currentProductImageSet.image_urls[index];
    this.selectedImageOption = `button ${index}`;
  }

  plusQuantity() : void
  {
    const nextValue = this.selectedQuantity + 1;
    if (this.quantityCheck(nextValue))
    {
      this.selectedQuantity += 1;
    }
  }

  minusQuantity() : void
  {
    const nextValue = this.selectedQuantity - 1;
    if (this.quantityCheck(nextValue))
    {
      this.selectedQuantity -= 1;
    }
  }

  quantityCheck(nextQuantity : number) : boolean
  {
    if (1 <= nextQuantity && nextQuantity <= this.productData.stock)
    {
      return true;
    }
    return false;
  }

  sizeSelected(size : string)
  {
    this.selectedSizeOption = size;
  }

  addToCart() : void
  {
    if (this.isLoggedIn)
    {
      const cart_line = {
        _id : "",
        cart_id : this._authService.currentUser.cart,
        has_customized : false,
        product_id : this.productData._id,
        quantity : this.selectedQuantity
      }

      this._cartService.insertCartLine(cart_line);
    }
    else
    {
      this._router.navigate(["/login"]);
    }
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
    for (let review of this.reviews)
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
