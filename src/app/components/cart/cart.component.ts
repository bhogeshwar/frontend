import { Component, OnInit } from '@angular/core';
import { CartService } from "../../services/cart.service";
import { Observable } from "rxjs";
import { CartModelServer } from "../../models/cart.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartData: any;
  cartTotal: number | undefined;
  subTotal = 0;

  constructor(public cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  ChangeQuantity(id: number, increaseQuantity: Boolean) {
    this.cartService.UpdateCartData(id, increaseQuantity);
  }

}