import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Order} from "../models/Order.model";
import {Subject} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {


  orders: Order[] = [];
  ordersSubject = new Subject<Order[]>();

  constructor(private db: AngularFireDatabase, private auth: AuthService) { }

  emitOrders(){
    this.ordersSubject.next(this.orders);
  }

  saveOrders(){
    this.db.database.ref('/orders').set(this.orders);
  }

  getOrders(){
    this.db.database.ref('/orders').on('value',
      (data) => {
      this.orders = data.val() ? data.val() : [];
      this.emitOrders();
      });
  }

  getOrdersByUser() {
    var clientID = this.auth.getCurrentUserID();
    var ref = this.db.database.ref('/orders');
    ref.orderByChild('clientID').equalTo(clientID).on('value', (data) => {
      let result = [];
      data.forEach(child => {
        result.push(child.val());
      });
      this.orders = result ? result: [] ;
      this.emitOrders();
    });
  }

  getSingleOrder(id: string){
    return new Promise(
      (resolve, reject) => {
        this.db.database.ref('/orders/'+id).once('value').then(
          (data) => {
              resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewOrder(newOrder: Order){
    var newRef = this.db.database.ref('orders').push();
    var newKey = newRef.key;

    var updatedData = {} ;

    updatedData["orders/" + newKey] = true;
    updatedData["orders/" +newKey] = {
      orderID: newKey,
      clientID: newOrder.clientID,
      spotNR: newOrder.spotNR,
      installeurID: newOrder.installeurID,
      status: newOrder.status,
      locationID: newOrder.locationID,
      dateTime: newOrder.datesTimesToPick
    };
    this.db.database.ref().update(updatedData, function(error){
      if(error) {
        console.log("Error updating data :", error);
      }
    });
    this.orders.push(newOrder);
    this.emitOrders();
  }

  removeOrder(order: Order){
    const orderIndexToRemove = this.orders.findIndex(
      (orderEl) => {
        if(orderEl === order) {
          return true
        }
        return false;
      }
    );
    this.orders.splice(orderIndexToRemove, 1);
    this.saveOrders();
    this.emitOrders();
  }


}
