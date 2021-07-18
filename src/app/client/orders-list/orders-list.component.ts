import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order} from "../../models/Order.model";
import {Subscription} from "rxjs";
import {OrdersService} from "../../services/orders.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, OnDestroy {

  orders: Order[];
  ordersSubscription: Subscription;

  constructor(private orderService: OrdersService,
              private router: Router,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.ordersSubscription = this.orderService.ordersSubject.subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        console.log(this.orders);
      }
    );
    this.orderService.getOrdersByUser();
    this.orderService.emitOrders();
  }

  onViewOrder(id: string){
    this.router.navigate(['/orders', 'view', id]);
  }

  ngOnDestroy() {
    this.ordersSubscription.unsubscribe();
  }

}
