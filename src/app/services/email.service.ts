import {Injectable} from '@angular/core';
import emailjs from "emailjs-com";
import {User} from "../models/User.model";
import {Order} from "../models/Order.model";

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() {}


  sendConfirmationDateFirst(order: Order, user: User, installer: User) {
    emailjs.send("service_65oeh6z","template_bm30b48",{
      date: order.dateTimePicked.date,
      time: order.dateTimePicked.times[0].startTime+"-"+order.dateTimePicked.times[0].endTime,
      installerName: installer.firstName+" "+installer.lastName,
      installerPhonenr: '0'+installer.phoneNumber,
      installerEmail: installer.email,
      userEmail: user.email,
      reply_to: "aa",
      meeeting: 'first'
    }, "user_AX1MoTIBVJH24B3wUiQfI");
  }

  sendConfirmationDateSecond(order: Order, user: User, installer: User){
    emailjs.send("service_65oeh6z","template_8rjilzi",{
      date: order.dateTimePicked.date,
      time: order.dateTimePicked.times[0].startTime+"-"+order.dateTimePicked.times[0].endTime,
      installerName: installer.firstName,
      installerPhonenr: installer.lastName,
      installerEmail: installer.email,
      userEmail: user.email,
      meeeting: 'second'
    }, "user_AX1MoTIBVJH24B3wUiQfI");
  }

  sendNewOrderConfirmation(order: Order, installer: User){
    emailjs.send("service_65oeh6z","template_8rjilzi",{
      userEmail: installer.email,
    }, "user_AX1MoTIBVJH24B3wUiQfI");
  }

}
