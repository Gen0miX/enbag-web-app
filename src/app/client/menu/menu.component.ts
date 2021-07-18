import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {UsersService} from "../../services/users.service";
import {OrdersService} from "../../services/orders.service";
import {Order} from "../../models/Order.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private auth: AuthService,
              private ordersService: OrdersService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onNewOrder(){
    this.router.navigate(['/orders','new']);
  }

}
