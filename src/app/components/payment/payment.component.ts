import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartLine } from '../../interfaces/cart-line';
import { ProductDetails } from '../../interfaces/product-details';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrierService } from '../../services/carrier.service';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../toast/toast.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  addressBarToggle : boolean = true;
  isEnoughInformation : boolean = false;
  isEdit : boolean = true;
  showToast : boolean = false;

  customerName : string = "";
  phone : string = "";
  address : string = "";

  cartLines : CartLine[] = [];
  cartProducts : ProductDetails[] = [];

  note : string = "";
  carriers : any[] = [];
  selectedCarrier : any;
  carrierName : string = "";
  shippingType: string = "";
  shippingFee : number = 0;
  expectedDate : string = "";

  paymentMethods : any[] = ["COD", "Banking"];
  selectedMethod : string = "";
  account_name : string = "";
  account_number : string = "";
  bank_name : string = "";

  totalPrice : number = 0;


  constructor(private _authService : AuthService, private _cartService : CartService, private _carrierService : CarrierService, private _router : Router) {}

  ngOnInit(): void {
    this.cartLines = this._cartService.selectedCartLines;
    this.cartProducts = this._cartService.selectedCartProducts;
    this.customerName = this._cartService.customerName;
    this.phone = this._cartService.phone;
    this.address = this._cartService.address;
    this.totalPrice = this._cartService.totalPrice;

    this._carrierService.getCarrier().subscribe({
      next : carriers => {
        this.carriers = carriers;
        this.updateSelectedCarrier();
        this.updatePaymentMethod();
      }
    })
  }

  editMode() : void
  {
    if (this.customerName && this.phone && this.address)
    {
      this.isEdit = !this.isEdit;
    }
  }

  updateSelectedCarrier(i : number = 0)
  {
    this.selectedCarrier = this.carriers[i];
    this.carrierName = this.selectedCarrier.shipping_carrier;
    this.updateShippingType();
  }

  updateShippingType(i : number = 0)
  {
    this.shippingType = this.selectedCarrier.shipping_methods[i].method_name;
    this.shippingFee = this.selectedCarrier.shipping_methods[i].shipping_fee;
    this.expectedDate = this.addDaysToToday(this.selectedCarrier.shipping_methods[i].expected);
  }

  addDaysToToday(days: number): string {
    // Get today's date
    const today: Date = new Date();

    // Add the specified number of days
    today.setDate(today.getDate() + days);

    // Format the result back to DD/MM/YYYY
    const newDay: string = String(today.getDate()).padStart(2, '0');
    const newMonth: string = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const newYear: number = today.getFullYear();

    return `${newDay}/${newMonth}/${newYear}`;
  }

  updatePaymentMethod(i : number = 0) : void
  {
    this.selectedMethod = this.paymentMethods[i];
  }

  check() : boolean
  {
    if (!this.isEdit)
    {
      if (this.selectedMethod == "Banking")
      {
        if (this.account_name && this.account_number && this.bank_name)
        {
          return true;
        }
        return false
      }
      return true
    }
    return false;
  }

  confirmOrder() : void
  {
    let order;

    if (!this.check())
    {
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
      return;
    }
    else
    {
      this.isEnoughInformation = true;
    }


    if (this.selectedMethod == "COD")
    {
      order = {
        user_id : this._authService.currentUser._id,
        cart_line_ids : this.cartLines.map(cartLine => cartLine._id),
        shipping_carrier : this.carrierName,
        shipping_method : this.shippingType,
        shipping_fee : this.shippingFee,
        total_amount : this.totalPrice,
        payment_method : this.selectedMethod,
        receiver_name : this.customerName,
        receiver_phone_number : this.phone,
        destination : this.address,
        note : this.note,
      }
    }
    else {
      order = {
        user_id : this._authService.currentUser._id,
        cart_line_ids : this.cartLines.map(cartLine => cartLine._id),
        shipping_carrier : this.carrierName,
        shipping_method : this.shippingType,
        shipping_fee : this.shippingFee,
        total_amount : this.totalPrice,
        payment_method : this.selectedMethod,
        payment_details : {
          account_name : this.account_name,
          account_number : this.account_number,
          bank_name : this.bank_name
        },
        receiver_name : this.customerName,
        receiver_phone_number : this.phone,
        destination : this.address,
        note : this.note,
      }
    }

    console.log(order);

    this._cartService.insertOrder(order).subscribe({
      next : () => {
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
        this._cartService.getCartLines(this._authService.currentUser.cart).subscribe({
          next : () => {
            this._router.navigate([""]);
          }
        });
      }
    });
  }
}
