import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {OrdersService} from "../../services/orders.service";
import {Order} from "../../models/Order.model";
import {Router} from "@angular/router";
import {EmailService} from "../../services/email.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  ordersSubscription: Subscription;
  userId: string;
  orders: Order[];
  order: Order;
  object: Object;
  orderId: string;


  constructor(private auth: AuthService,
              private afAuth: AngularFireAuth,
              private ordersService: OrdersService,
              private router: Router,
              private email: EmailService) { }

  ngOnInit(): void {
   this.afAuth.authState.subscribe(user => {
     if (user) {this.userId = user.uid}
     this.ordersSubscription = this.ordersService.ordersSubject.subscribe(
       (orders: Order[]) => {
         this.orders = orders;
       }
     );
     this.ordersService.getOrdersByUser();
     this.ordersService.emitOrders();
    });
  }

  onNewOrder(){
    this.router.navigate(['/orders','new']);
  }

  onOrderCreated(orderId: string){
    this.router.navigate(['/orders','view', orderId])
  }

  isOrderCreated(): boolean {
   if(this.orders.length != 0) {
      return true;
    }else {
      return false;
    }
  }
}
