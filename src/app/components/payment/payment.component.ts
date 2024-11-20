import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartLine } from '../../interfaces/cart-line';
import { ProductDetails } from '../../interfaces/product-details';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  addressBarToggle : boolean = true;
  isEnoughInformation : boolean = false;
  isEdit : boolean = false;

  customerName : string = "";
  phone : string = "";
  address : string = "";

  cartLines : CartLine[] = [];
  cartProducts : ProductDetails[] = [];

  totalPrice : number = 0;

  constructor(private _cartService : CartService) {}

  ngOnInit(): void {
    this.cartLines = this._cartService.selectedCartLines;
    this.cartProducts = this._cartService.selectedCartProducts;
    this.customerName = this._cartService.customerName;
    this.phone = this._cartService.phone;
    this.address = this._cartService.address;
  }

  editMode() : void
  {
    if (this.checkInformation())
    {
      this.isEdit = !this.isEdit;
    }
  }

  checkInformation() : boolean
  {
    if (this.customerName && this.phone && this.address)
    {
      this._cartService.customerName = this.customerName;
      this._cartService.phone = this.phone;
      this._cartService.address = this.address;
      return true;
    }
    return false;
  }
}
