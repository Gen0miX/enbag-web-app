import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrdersService} from "../../../services/orders.service";
import {Order} from "../../../models/Order.model";
import {User} from "../../../models/User.model";
import {AuthService} from "../../../services/auth.service";
import {UsersService} from "../../../services/users.service";
import {LocationService} from "../../../services/location.service";
import {Location} from "../../../models/Location.model";
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher, MatOptionSelectionChange} from "@angular/material/core";
import {DateTime} from "../../../models/DateTime.model";
import {Time} from "../../../models/Time.model";
import {EmailService} from "../../../services/email.service";
import {MyErrorStateMatcher} from "../../matcher/MyErrorStateMatcher.matcher";
import {DatePipe} from "@angular/common";

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
  dateForm: FormGroup;
  isSubmitted = false;
  matcher = new MyErrorStateMatcher(this.isSubmitted);
  spotNRForm: FormGroup;
  nrIsSubmitted=false;
  toggle=false;
  times = [{
    value: 1,
    startTime: '08:00',
    endTime: '09:00'
  }, {
    value: 2,
    startTime: '09:00',
    endTime: '10:00'
  }, {
    value: 3,
    startTime: '10:00',
    endTime: '11:00'
  }, {
    value: 4,
    startTime: '11:00',
    endTime: '12:00'
  }, {
    value: 5,
    startTime: '13:30',
    endTime: '14:30'
  }, {
    value: 6,
    startTime: '14:30',
    endTime: '15:30'
  }, {
    value: 7,
    startTime: '15:30',
    endTime: '16:30'
  }, {
    value: 8,
    startTime: '16:30',
    endTime: '17:30'
  }];

  constructor(private route: ActivatedRoute,
              private orderSrv: OrdersService,
              private router: Router,
              private auth: AuthService,
              private userSrv: UsersService,
              private locationSrv: LocationService,
              private formBuilder: FormBuilder,
              private emailSrv: EmailService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.order = new Order('', 0, '', 0, '', '', '');
    const id = this.route.snapshot.params['id'];
    this.orderSrv.getSingleOrder(id).then(
      (order: Order) => {
        this.order = order;
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
    });
    this.dateForm = this.formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
    this.spotNRForm = this.formBuilder.group({
      spotNR: ['', Validators.required]
    });
  }

    onDateSubmit(){
    this.order.dateTimePicked = this.dateSelected;
    this.order.status = "first appointment set"
    this.orderSrv.updateOrder(this.order);
    this.emailSrv.sendConfirmationDateFirst(this.order, this.user, this.installateur);
  }

  optionSelected(event: MatOptionSelectionChange){
    let timesTMP: Time[] = [];
    timesTMP.push(event.source.value);
    this.dateSelected = new DateTime(event.source.group.label, timesTMP);
  }

  sendDateForSecondAppointment(){

    let formValue = this.dateForm.value;
    let time: Time;
    let date: string;
    let dateTime: DateTime;

    if(this.dateForm.invalid){
      this.isSubmitted = true;
      this.matcher.setIsSubmitted(this.isSubmitted);
      return;
    }
    date = this.datePipe.transform(formValue['date'], 'dd/MM/yyyy');
    time = formValue['time'][0];
    dateTime = new DateTime(date, []);
    dateTime.times.push(time);

    this.order.dateTimePicked = dateTime;
    this.order.status = 'second appointment set'
    this.orderSrv.updateOrder(this.order);
    this.isSubmitted = false;
    this.matcher.setIsSubmitted(this.isSubmitted);
    this.emailSrv.sendConfirmationDateSecond(this.order, this.user, this.installateur);
  }

  setPaymentStatus(){
    this.order.status = 'waiting for payment';
    this.orderSrv.updateOrder(this.order);
  }

  filters = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    const date = (d || new Date());
    return day !== 0 && day !== 6 && date > new Date();
  }

  onNewSpotNRSubmit(){
    if(this.spotNRForm.invalid){
      this.nrIsSubmitted = true;
      return;
    }

    const spotNR = this.spotNRForm.get('spotNR').value;
    this.order.spotNR = spotNR;
    this.orderSrv.updateOrder(this.order);
    this.spotNRForm.reset();
    this.nrIsSubmitted = false;
    this.toggleForm();
  }

  toggleForm(){
    this.toggle = !this.toggle;
  }

}

