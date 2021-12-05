import { Component, OnInit } from '@angular/core';
import { CartService } from "../../services/cart.service";
import { CartModelServer } from "../../models/cart.model";
import { Router } from "@angular/router";
import { OrderService } from "../../services/order.service";
import { FormBuilder, NgForm, Validators } from "@angular/forms";
import { isNull } from 'lodash';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  carDataTemp: any;

  cartData!: CartModelServer;
  cartTotal: number;
  // showSpinner: Boolean;
  checkoutForm: any;
  constructor(private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    // private spinner: NgxSpinnerService,
    private fb: FormBuilder) {

    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],

    });


  }

  ngOnInit(): void {
    this.cartService.cartDataObs$.subscribe(data => {
      // this.cartData = data
      this.carDataTemp = data;

      if (this.carDataTemp.total > 0) {
        this.cartData.total = this.carDataTemp.total;
      }
      if (!(this.carDataTemp.data == null)) {
        this.cartData.data = this.carDataTemp.data;
      }
    });


    this.cartService.cartTotal$.subscribe(total => {
      if (!(total == null)) {
        this.cartTotal = total;
      }
    });

  }

  onCheckout() {
    // this.spinner.show().then(p =
    this.cartService.CheckoutFromCart(1);
  };

}
