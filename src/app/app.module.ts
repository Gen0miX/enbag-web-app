import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AngularFireModule} from "@angular/fire";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {RouterModule, Routes} from "@angular/router";

import { AppComponent } from './app.component';
import {environment} from "../environments/environment";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { MenuComponent } from './client/menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrdersListComponent } from './client/orders-list/orders-list.component';
import { SingleOrderComponent } from './client/orders-list/single-order/single-order.component';
import {NewOrderComponent} from "./client/orders-list/new-order/new-order.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {DatePipe} from "@angular/common";
import {MyDateAdapter} from "./adapter/myDateAdapter.adapter";
import { NewOrderSuccessComponent } from './client/orders-list/new-order-success/new-order-success.component';
import {DateTimeComponent} from "./client/date-time/date-time.component";
import { MakePaymentComponent } from './payments/payment/make-payment/make-payment.component';
import {AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";


const appRoutes: Routes = [
  {path: 'auth/signin', component: SigninComponent},
  {path: ':location/auth/signin', component: SigninComponent},
  {path: ':location/auth/signup', component: SignupComponent},
  {path: 'menu', component: MenuComponent, canActivate: [AngularFireAuthGuard]},
  {path:'orders/new', component: NewOrderComponent, canActivate: [AngularFireAuthGuard]},
  {path:'orders/new/success/:id', component: NewOrderSuccessComponent, canActivate: [AngularFireAuthGuard]},
  {path: 'orders', component: OrdersListComponent, canActivate: [AngularFireAuthGuard]},
  {path: 'orders/view/:id', component: SingleOrderComponent, canActivate: [AngularFireAuthGuard]},
  {path: '', redirectTo:'auth/signin', pathMatch:'full'},
  {path:'**', redirectTo:'auth/signin'}

]

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    MenuComponent,
    HeaderComponent,
    OrdersListComponent,
    SingleOrderComponent,
    NewOrderComponent,
    NewOrderSuccessComponent,
    DateTimeComponent,
    MakePaymentComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatListModule,
    MatGridListModule,
    AngularFireModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    DatePipe,
    {provide: DateAdapter, useClass: MyDateAdapter}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
