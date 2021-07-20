import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrdersService} from "../../../services/orders.service";
import {Order} from "../../../models/Order.model";
import {User} from "../../../models/User.model";
import {AuthService} from "../../../services/auth.service";
import {UsersService} from "../../../services/users.service";
import {LocationService} from "../../../services/location.service";
import {Location} from "../../../models/Location.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatOptionSelectionChange} from "@angular/material/core";
import {DateTime} from "../../../models/DateTime.model";
import {Time} from "../../../models/Time.model";
import {EmailService} from "../../../services/email.service";

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.scss']
})
export class SingleOrderComponent implements OnInit {

  order: Order;
  currentUser: User;
  user: User;
  dateSelected: DateTime
  installateur: User;
  orderLocation: Location;
  dateTimeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private orderSrv: OrdersService,
              private router: Router,
              private auth: AuthService,
              private userSrv: UsersService,
              private locationSrv: LocationService,
              private formBuilder: FormBuilder,
              private emailSrv: EmailService) { }

  ngOnInit(): void {
    this.order = new Order('', '', 0, '', '', '');
    const id = this.route.snapshot.params['id'];
    this.orderSrv.getSingleOrder(id).then(
      (order: Order) => {
        this.order = order;
        console.log(this.order.datesTimesToPick);
        this.userSrv.getUserByIdOnInit(this.order.installeurID).then(
          (user: User) => {
            this.installateur = user;
          }
        );
        this.userSrv.getUserByIdOnInit(this.order.clientID).then(
          (user: User) => {
            this.user = user;
          }
        )
        this.locationSrv.getSingleLocation(this.order.locationID).then(
          (location: Location) => {
            this.orderLocation = location;
            console.log(this.orderLocation);
          }
        );
      }
    );
    this.userSrv.getUserByIdOnInit(this.auth.getCurrentUserID()).then(
      (user: User) => {
        this.currentUser = user;
      }
    );
    this.initForm();
  }

  initForm(){
    this.dateTimeForm = this.formBuilder.group({
      dateTimes:['', Validators.required]
    })
  }

    onDateSubmit(){
    console.log(this.dateSelected);
    this.order.dateTimePicked = this.dateSelected;
    this.order.status = "first appointment set"
    this.orderSrv.updateOrder(this.order);
    this.emailSrv.sendConfirmationDate(this.order, this.user, this.installateur);
  }

  optionSelected(event: MatOptionSelectionChange){
    let timesTMP: Time[] = [];
    timesTMP.push(event.source.value);
    this.dateSelected = new DateTime(event.source.group.label, timesTMP);
  }

}
