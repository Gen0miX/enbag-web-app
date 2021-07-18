import {Component, OnInit, ViewChild} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Order} from "../../../models/Order.model";
import {OrdersService} from "../../../services/orders.service";
import {NgbDateStruct, NgbModule, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe, Time} from "@angular/common";
import {MatListOption} from "@angular/material/list";
import {DateAdapter} from "@angular/material/core";
import {DateTime} from "../../../models/DateTime.model";
import firebase from "firebase";
import {User} from "../../../models/User.model";
import {UsersService} from "../../../services/users.service";
import {AuthService} from "../../../services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {

  @ViewChild('NgbdDatepicker') d: NgbDateStruct;

  orderForm: FormGroup;
  dateForm: FormGroup;
  timesSelectedForm: MatListOption[];
  dateSelected: string;
  datesTime: DateTime [] = new Array();
  isTimeSelected: boolean = true;
  installateurs: User[];
  idInstallateur: string;
  userSubscription: Subscription;
  times = [{
    startTime: '08:00',
    endTime: '09:00'
  }, {
    startTime: '09:00',
    endTime: '10:00'
  }, {
    startTime: '10:00',
    endTime: '11:00'
  }, {
    startTime: '11:00',
    endTime: '12:00'
  }, {
    startTime: '13:30',
    endTime: '14:30'
  }, {
    startTime: '14:30',
    endTime: '15:30'
  }, {
    startTime: '15:30',
    endTime: '16:30'
  }, {
    startTime: '16:30',
    endTime: '17:30'
  }];

  constructor(private formBuilder: FormBuilder,
              private orderService: OrdersService,
              private usersService: UsersService,
              private auth: AuthService,
              private dateAdapter: DateAdapter<Date>,
              private datePipe: DatePipe) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.initForm();
    this.userSubscription = this.usersService.usersSubject.subscribe(
      (users: User[]) => {
        this.installateurs = users;
        this.getInstallateurId();
        console.log("id: "+this.idInstallateur);
      }
    )
    this.usersService.getInstallateurs();
  }

  initForm(){
    this.orderForm = this.formBuilder.group({
      spotNR: ['', Validators.required],
    });
    this.dateForm = this.formBuilder.group({
      date: ['', Validators.required],
      timeList: [[]]
    })
  }

  onSubmitForm(){
    let orderTMP = new Order('', this.auth.getCurrentUserID(), this.orderForm.get('spotNR').value,
                              this.idInstallateur, 'new', this.usersService.getCurrentUserLocation());
    orderTMP.datesTimesToPick = this.datesTime;
    this.orderService.createNewOrder(orderTMP);
  }


  onAddDates(){
    if(this.timesSelectedForm == undefined){
      this.isTimeSelected = false;
      return;
    }else {
      this.isTimeSelected = true;
    }
    const formValue = this.dateForm.value;
    this.dateSelected = this.datePipe.transform(formValue['date'], 'dd/MM/yyyy');
    console.log(this.dateSelected);
    for(let time of this.timesSelectedForm){
      let dateTimeTmp = new DateTime(this.dateSelected,
                        time.value.startTime, time.value.endTime);

      this.datesTime.push(dateTimeTmp);
    }
    this.dateForm.reset();
    this.timesSelectedForm = undefined;
  }

  onGroupsChange(options: MatListOption[]) {
    if(options.map(o => o.value).length == 0){
      this.isTimeSelected = false;
    }else {
      this.isTimeSelected = true;
    }
    this.timesSelectedForm = options;
    console.log(this.timesSelectedForm.map(o => o.value));
  }

  filters = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    const date = (d || new Date());
    return day !== 0 && day !== 6 && date > new Date();
  }

  getInstallateurId(){
    for(let installateur of this.installateurs){
      if(installateur.location == this.usersService.getCurrentUserLocation()){
        this.idInstallateur = installateur.id;
      }else {
        this.idInstallateur =' ';
      }
    }
  }

}
