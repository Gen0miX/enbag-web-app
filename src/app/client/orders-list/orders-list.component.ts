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
      }
    );
    this.orderService.getOrders();
    this.orderService.getOrdersByInstaller();
    this.orderService.emitOrders();
  }

  onViewOrder(id: string){
    this.router.navigate(['/orders', 'view', id]);
  }

  arrayFilter(status:string): Order[]{
    let arrayFiltered = this.orders.filter(element => {
      return element.status == status;
    });
    return arrayFiltered
  }

  ngOnDestroy() {
    this.ordersSubscription.unsubscribe();
  }

}
