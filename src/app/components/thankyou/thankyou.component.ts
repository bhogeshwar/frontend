import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { OrderService } from "../../services/order.service";

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  message: String;
  orderId: Number;
  products: ProductResponseModel[] = [];
  cartTotal: Number;
  constructor(private router: Router,
    private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      message: String,
      products: ProductResponseModel[],
      orderId: Number,
      total: Number
    };

    this.message = state.message;
    this.orderId = state.orderId;
    this.products = state.products;
    this.cartTotal = state.total;
    console.log(this.products);
  }

  ngOnInit(): void {

  }

}

interface ProductResponseModel {
  id: Number;
  title: String;
  description: String;
  price: Number;
  quantityOrdered: Number;
  image: String;
}