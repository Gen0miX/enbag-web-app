import { Component, OnInit } from '@angular/core';
import {Order} from "../../../models/Order.model";
import {ActivatedRoute, Router} from "@angular/router";
import {OrdersService} from "../../../services/orders.service";
import {LocationStrategy} from "@angular/common";

@Component({
  selector: 'app-new-order-success',
  templateUrl: './new-order-success.component.html',
  styleUrls: ['./new-order-success.component.scss']
})
export class NewOrderSuccessComponent implements OnInit {

  order: Order;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orderService: OrdersService,
              private locationStrategy: LocationStrategy) { }

  ngOnInit(): void {
    this.order = new Order('',0, '', 0, '', '', '');
    const id = this.route.snapshot.params['id'];
    this.orderService.getSingleOrder(id).then(
      (order: Order) => {
        this.order = order;
        this.order.datesTimesToPick = order.datesTimesToPick;
      }
    );
    this.preventBackButton();
  }

  preventBackButton(){
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  backToMenu(){
    this.router.navigate(['/menu'])
  }

}
