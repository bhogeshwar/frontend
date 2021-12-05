import { identifierModuleUrl } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FruitsComponent } from './components/fruits/fruits.component';
import { HomeComponent } from './components/home/home.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { VegitablesComponent } from './components/vegitables/vegitables.component';
import { ProductComponent } from './components/product/product.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'fruits/:id', component: FruitsComponent
  },
  {
    path: 'vegitables/:id', component: VegitablesComponent
  },
  {
    path: 'product/:id', component: ProductComponent
  },
  {
    path: 'cart', component: CartComponent
  },
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'thankyou', component: ThankyouComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
