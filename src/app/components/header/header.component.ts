import { Component, OnInit } from '@angular/core';
import { CartService } from "../../services/cart.service";
import { CartModelServer } from "../../models/cart.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartDataTemp: any;
  cartData = {} as CartModelServer;
  cartTotal: Number | undefined;

  constructor(public cartService: CartService) {
  }

  ngOnInit() {
    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal = total;
    });

    this.cartService.cartDataObs$.subscribe(data => {
      if (!(data == null)) {
        this.cartDataTemp = data;

        if (!(this.cartDataTemp.total == null)) {
          this.cartData.total = this.cartDataTemp.total;
        }
        if (!(this.cartDataTemp.data == null)) {
          this.cartData.data = this.cartDataTemp.data;
        }
      }
    });
  }
}
