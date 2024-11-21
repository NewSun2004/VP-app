import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartLine } from '../../interfaces/cart-line';
import { ProductDetails } from '../../interfaces/product-details';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrierService } from '../../services/carrier.service';

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
  isEdit : boolean = true;

  customerName : string = "";
  phone : string = "";
  address : string = "";

  cartLines : CartLine[] = [];
  cartProducts : ProductDetails[] = [];

  note : string = "";
  carriers : any[] = [];
  carrierName : string = "";
  shippingType: string = "";
  shippingFee : number = 0;

  totalPrice : number = 0;


  constructor(private _cartService : CartService, private _carrierService : CarrierService) {}

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
        this.updateShipping();
        console.log(this.carriers);
      }
    })
  }

  editMode() : void
  {
    if (this.customerName && this.phone && this.address)
    this.isEdit = !this.isEdit;
  }

  updateShipping(i : number = 0)
  {
    this.carrierName = this.carriers[i].shipping_carrier;
    this.shippingType = this.carriers[i].shipping_methods[0].method_name;
    this.shippingFee = this.carriers[i].shipping_methods[0].shipping_fee;
  }
}
