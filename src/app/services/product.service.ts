import { Injectable, ɵresetJitOptions } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs';
import { ProductModelServer } from '../models/product.model';
import { ServerResponse } from 'http';



export class ProductService {
  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) { }
  /*To fetch all products from backend server*/
  getAllProducts(numberOfResuts: number = 10): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products',
      { params: { limit: numberOfResuts.toString() } });
  }
  /* get a single product from server*/
  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.SERVER_URL + '/products/' + id);
  }
  /*Get products from one category*/
  getProductsFromCategory(catName: string): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(this.SERVER_URL + '/products/category/' + catName);
  }
}
