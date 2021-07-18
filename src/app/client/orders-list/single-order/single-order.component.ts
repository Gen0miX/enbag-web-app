import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrdersService} from "../../../services/orders.service";
import {Order} from "../../../models/Order.model";

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.scss']
})
export class SingleOrderComponent implements OnInit {

  order: Order;

  constructor(private route: ActivatedRoute,
              private orderService: OrdersService,
              private router: Router) { }

  ngOnInit(): void {
    this.order = new Order('', '', 0, '', '', '');
    const id = this.route.snapshot.params['id'];
    this.orderService.getSingleOrder(id).then(
      (order: Order) => {
        this.order = order;

        console.log();
      }
    );
  }

}
