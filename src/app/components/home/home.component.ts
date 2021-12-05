import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product2Service } from 'src/app/services/product2.service';
import { ProductModelServer, serverResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  temp: any;

  products: ProductModelServer[] = [];

  constructor(private productService: Product2Service,
    private cartService: CartService,
    private router: Router) { }

  selectProduct(id: Number) {
    this.router.navigate(['/product', id]).then();

  }
  ngOnInit() {
    this.productService.getAllProducts(8).subscribe(data => {

      this.temp = data;
      this.products = this.temp.products;

      console.log(this.temp.products);
    });
  }


  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }
}




