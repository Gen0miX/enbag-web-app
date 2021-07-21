import {Component, OnInit, ViewChild} from '@angular/core';
import {
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from "@angular/forms";
import {Order} from "../../../models/Order.model";
import {OrdersService} from "../../../services/orders.service";
import {NgbDateStruct, NgbModule, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {MatListOption} from "@angular/material/list";
import {DateAdapter, ErrorStateMatcher} from "@angular/material/core";
import {DateTime} from "../../../models/DateTime.model";
import firebase from "firebase";
import {User} from "../../../models/User.model";
import {UsersService} from "../../../services/users.service";
import {AuthService} from "../../../services/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {Time} from "../../../models/Time.model";
import {MyErrorStateMatcher} from "../../matcher/MyErrorStateMatcher.matcher";
import {EmailService} from "../../../services/email.service";

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
  dateTimes: DateTime [] = new Array();
  isTimeSelected: boolean = true;
  submittedF = false;
  submittedD = false;
  matcher = new MyErrorStateMatcher(this.submittedD);
  installateurs: User[];
  idInstallateur: string;
  userSubscription: Subscription;
  isDateTimeAdded = false;
  installer: User;
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

  constructor(private formBuilder: FormBuilder,
              private orderService: OrdersService,
              private usersService: UsersService,
              private auth: AuthService,
              private dateAdapter: DateAdapter<Date>,
              private datePipe: DatePipe,
              private route: Router,
              private emailSrv: EmailService) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.initForm();
    this.userSubscription = this.usersService.usersSubject.subscribe(
      (users: User[]) => {
        this.installateurs = users;
        this.getInstallateurId();
        this.usersService.getUserByIdOnInit(this.idInstallateur).then(
          (user: User) => {
            this.installer = user;
          }
        );
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
    });
  }

  get fO() {return this.orderForm.controls;}
  get fD() {return this.dateForm.controls;}

  onSubmitForm(buttonType){

    if(buttonType == "submitDate"){
      this.submittedD = true;
      this.matcher.setIsSubmitted(this.submittedD);
      this.onSubmitDate();
    }

    if(buttonType == "submitForm"){
      this.submittedF = true;
      if(this.orderForm.invalid){
        return;
      }
      if(this.dateTimes.length == 0){
        return;
      }

      const orderID = '';
      const userID = this.auth.getCurrentUserID();
      const spotNR = this.orderForm.get('spotNR').value;
      const status = 'new';
      const userLocation = this.usersService.getCurrentUserLocation();

      let orderTMP = new Order(orderID, userID, spotNR, this.idInstallateur, status, userLocation);
      orderTMP.datesTimesToPick = this.dateTimes;
      this.orderService.createNewOrder(orderTMP);
      this.emailSrv.sendNewOrderConfirmation(orderTMP, this.installer);
      this.onViewSuccess(this.orderService.myOrderKey);
    }

  }


  onSubmitDate(){
    if(this.dateForm.invalid){
      return;
    }
    if(this.timesSelectedForm == undefined){
      this.isTimeSelected = false;
      return;
    }else {
      this.isTimeSelected = true;
    }

    let formValue = this.dateForm.value;
    let times: Time[] = [];
    let dateTimes: DateTime = null;
    this.dateSelected = this.datePipe.transform(formValue['date'], 'dd/MM/yyyy');
    console.log(this.dateSelected);
    for(let time of this.timesSelectedForm){
      let timeTMP = new Time(time.value.value, time.value.startTime, time.value.endTime);
      times.push(timeTMP)
    }
    dateTimes = new DateTime(this.dateSelected, times);
    console.log(dateTimes);
    this.dateTimes.push(dateTimes);
    this.dateTimeReformat();
    this.dateForm.reset();
    this.isDateTimeAdded = true;
    this.submittedD = false;
    this.matcher.setIsSubmitted(this.submittedD);
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
    return day !== 0 && day !== 6 && date > new Date() && this.checkDateAdded(d) ;
  }

 checkDateAdded(d: Date): boolean {
    let dString = this.datePipe.transform(d, 'dd/MM/yyyy')
    for(let dateTime of this.dateTimes){
      if(dateTime.date == dString){
        return false;
      }
    }
    return true;
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

  onViewSuccess(id: string){
    this.route.navigate(['/orders', 'new', 'success', id]);
  }

  dateTimeReformat(){
   this.dateTimes.sort((a,b) => parseFloat(a.date) - parseFloat(b.date));
    for(let date of this.dateTimes){
      date.times.sort((a,b) => (a.value) - (b.value));
    }
  }

}
