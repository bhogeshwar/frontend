import { Injectable } from '@angular/core';
import { Product2Service } from "./product2.service";
import { BehaviorSubject } from "rxjs";
import { CartModelPublic, CartModelServer } from "../models/cart.model";
import { ProductModelServer } from "../models/product.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { NavigationExtras, Router } from "@angular/router";
import { OrderService } from "./order.service";
//import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";


@Injectable({
    providedIn: 'root'
})

export class CartService {

    private serverURL = environment.SERVER_URL;
    orderResponse: any;
    checkOutResponse: any;

    private cartDataClient: CartModelPublic = { prodData: [{ incart: 0, id: 0 }], total: 0 };  // This will be sent to the backend Server as post data
    // Cart Data variable to store the cart information on the server
    private cartDataServer: CartModelServer = {
        data: [{
            numInCart: 0,
            product: {} as ProductModelServer,
        }],
        total: 0
    };
    cartTotal$ = new BehaviorSubject<number>(0);
    // Data variable to store the cart information on the client's local storage

    cartDataObs$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);

    constructor(private productService: Product2Service,
        private orderService: OrderService,
        private httpClient: HttpClient,
        private router: Router,
        // private spinner: NgxSpinnerService,
        private toast: ToastrService) {

        this.cartTotal$.next(this.cartDataServer.total);
        this.cartDataObs$.next(this.cartDataServer);

        let info: CartModelPublic = JSON.parse(localStorage.getItem('cart')!);
        if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
            // assign the value to our data variable which corresponds to the LocalStorage data format
            this.cartDataClient = info;
            // Loop through each entry and put it in the cartDataServer object
            this.cartDataClient.prodData.forEach(p => {
                this.productService.getSingleProduct(p.id).subscribe((actualProdInfo: ProductModelServer) => {
                    if (this.cartDataServer.data[0].numInCart === 0) {
                        this.cartDataServer.data[0].numInCart = p.incart;
                        this.cartDataServer.data[0].product = actualProdInfo;
                        this.cartDataClient.total = this.cartDataServer.total;
                        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                    } else {
                        this.cartDataServer.data.push({
                            numInCart: p.incart,
                            product: actualProdInfo
                        });
                        this.CalculateTotal();
                        this.cartDataClient.total = this.cartDataServer.total;
                        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                    }
                    this.cartDataObs$.next({ ...this.cartDataServer });
                });
            });
        }
    }
    CalculateSubTotal(index: number) {
        let subTotal = 0;

        let p = this.cartDataServer.data[index];
        // @ts-ignore
        subTotal = p.product.price * p.numInCart;

        return subTotal;
    }
    AddProductToCart(id: number, quantity?: number) {

        this.productService.getSingleProduct(id).subscribe(prod => {
            // If the cart is empty
            if (this.cartDataServer.data[0].product === undefined) {
                this.cartDataServer.data[0].product = prod;
                this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
                this.CalculateTotal();
                this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
                this.cartDataClient.prodData[0].id = prod.id;
                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                this.cartDataObs$.next({ ...this.cartDataServer });
                this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
                    timeOut: 1500,
                    progressBar: true,
                    progressAnimation: 'increasing',
                    positionClass: 'toast-top-right'
                })
            }
            else {
                let index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id);

                // 1. If chosen product is already in cart array
                if (index !== -1) {

                    if (quantity !== undefined && quantity <= prod.quantity) {
                        // @ts-ignore
                        this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
                    } else {
                        // @ts-ignore
                        this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
                    }


                    this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
                    this.toast.info(`${prod.name} quantity updated in the cart.`, "Product Updated", {
                        timeOut: 1500,
                        progressBar: true,
                        progressAnimation: 'increasing',
                        positionClass: 'toast-top-right'
                    })
                }
                else {
                    this.cartDataServer.data.push({
                        product: prod,
                        numInCart: 1
                    });
                    this.cartDataClient.prodData.push({
                        incart: 1,
                        id: prod.id
                    });
                    this.toast.success(`${prod.name} added to the cart.`, "Product Added", {
                        timeOut: 1500,
                        progressBar: true,
                        progressAnimation: 'increasing',
                        positionClass: 'toast-top-right'
                    })
                }
                this.CalculateTotal();
                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                this.cartDataObs$.next({ ...this.cartDataServer });

            }  // END of ELSE


        });
    }
    UpdateCartData(index: number, increase: Boolean) {
        let data = this.cartDataServer.data[index];
        if (increase) {
            // @ts-ignore
            data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
            this.cartDataClient.prodData[index].incart = data.numInCart;
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            this.cartDataObs$.next({ ...this.cartDataServer });
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        } else {
            // @ts-ignore
            data.numInCart--;

            // @ts-ignore
            if (data.numInCart < 1) {
                this.DeleteProductFromCart(index);
                this.cartDataObs$.next({ ...this.cartDataServer });
            } else {
                // @ts-ignore
                this.cartDataObs$.next({ ...this.cartDataServer });
                this.cartDataClient.prodData[index].incart = data.numInCart;
                this.CalculateTotal();
                this.cartDataClient.total = this.cartDataServer.total;
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }

        }

    }
    DeleteProductFromCart(index: number) {
        /*    console.log(this.cartDataClient.prodData[index].prodId);
            console.log(this.cartDataServer.data[index].product.id);*/

        if (window.confirm('Are you sure you want to delete the item?')) {
            this.cartDataServer.data.splice(index, 1);
            this.cartDataClient.prodData.splice(index, 1);
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;

            if (this.cartDataClient.total === 0) {
                this.cartDataClient = { prodData: [{ incart: 0, id: 0 }], total: 0 };
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }

            if (this.cartDataServer.total === 0) {
                this.cartDataServer = {
                    data: [{
                        product: {} as ProductModelServer,
                        numInCart: 0
                    }],
                    total: 0
                };
                this.cartDataObs$.next({ ...this.cartDataServer });
            } else {
                this.cartDataObs$.next({ ...this.cartDataServer });
            }
        }
        // If the user doesn't want to delete the product, hits the CANCEL button
        else {
            return;
        }


    }
    CheckoutFromCart(userId: Number) {

        this.httpClient.post(`${this.serverURL}/orders/payment`, null).subscribe(res => {
            console.clear();
            this.checkOutResponse = res;

            if (this.checkOutResponse.success) {

                this.resetServerData();
                this.httpClient.post(`${this.serverURL}orders/new`, {
                    userId: userId,
                    products: this.cartDataClient.prodData
                }).subscribe(data => {
                    this.orderResponse = data;

                    this.orderService.getSingleOrder(this.orderResponse.order_id).then(prods => {
                        if (this.orderResponse.success) {
                            const navigationExtras: NavigationExtras = {
                                state: {
                                    message: this.orderResponse.message,
                                    products: prods,
                                    orderId: this.orderResponse.order_id,
                                    total: this.cartDataClient.total
                                }
                            };
                            //   this.spinner.hide().then();
                            this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                                this.cartDataClient = { prodData: [{ incart: 0, id: 0 }], total: 0 };
                                this.cartTotal$.next(0);
                                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                            });
                        }
                    });

                })
            } else {
                // this.spinner.hide().then();
                this.router.navigateByUrl('/checkout').then();
                this.toast.error(`Sorry, failed to book the order`, "Order Status", {
                    timeOut: 1500,
                    progressBar: true,
                    progressAnimation: 'increasing',
                    positionClass: 'toast-top-right'
                })
            }
        })
    }


    private CalculateTotal() {
        let Total = 0;

        this.cartDataServer.data.forEach(p => {
            const { numInCart } = p;
            const { price } = p.product;
            // @ts-ignore
            Total += numInCart * price;
        });
        this.cartDataServer.total = Total;
        this.cartTotal$.next(this.cartDataServer.total);
    }

    private resetServerData() {
        this.cartDataServer = {
            data: [{
                product: {} as ProductModelServer,
                numInCart: 0
            }],
            total: 0
        };
        this.cartDataObs$.next({ ...this.cartDataServer });
    }

}

interface OrderResponse {
    order_id: number;
    success: Boolean;
    message: String;
    products: [{
        id: String,
        numInCart: String
    }];
}




