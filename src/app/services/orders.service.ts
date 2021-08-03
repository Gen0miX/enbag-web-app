import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {Order} from "../models/Order.model";
import {Subject} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {


  orders: Order[] = [];
  ordersSubject = new Subject<Order[]>();
  myOrderKey: string = 'null';

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

  getOrdersByInstaller(){
    var clientID = this.auth.getCurrentUserID();
    var ref = this.db.database.ref('/orders');
    ref.orderByChild('installeurID').equalTo(clientID).on('value', (data) => {
      let result = [];
      data.forEach(child => {
        result.push(child.val());
      });
      this.orders = result ? result: [] ;
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

  getSingleOrderByUserId(id: string){
    return new Promise(
      (resolve, reject) => {
        this.db.database.ref('/orders').orderByChild('clientID').equalTo(id).once('value').then(
          (data) => {
            resolve(data);
          }, (error) => {
            reject(error);
          }
        )
      }
    )
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
    this.myOrderKey = newRef.key;

    var updatedData = {} ;

    updatedData["orders/" + this.myOrderKey] = true;
    updatedData["orders/" + this.myOrderKey] = {
      orderID: this.myOrderKey,
      orderNumber: newOrder.orderNumber,
      clientID: newOrder.clientID,
      spotNR: newOrder.spotNR,
      installeurID: newOrder.installeurID,
      status: newOrder.status,
      locationID: newOrder.locationID,
      datesTimesToPick: newOrder.datesTimesToPick
    };
    this.db.database.ref().update(updatedData, function(error){
      if(error) {
      }
    });
    this.orders.push(newOrder);
    this.emitOrders();
  }

  removeOrder(order: Order){
    this.db.database.ref('/orders/'+order.orderID).remove();
    const orderIndexToRemove = this.orders.findIndex(
      (orderEl) => {
        if(orderEl === order) {
          return true
        }
        return false;
      }
    );
    this.orders.splice(orderIndexToRemove, 1);
    this.emitOrders();
  }


  updateOrder(order: Order) {
    this.db.database.ref('/orders/'+order.orderID).set({
      orderID: order.orderID,
      orderNumber: order.orderNumber,
      clientID: order.clientID,
      spotNR: order.spotNR,
      installeurID: order.installeurID,
      status: order.status,
      locationID: order.locationID,
      dateTimePicked: order.dateTimePicked
    });
  }

  getOrderNumber() {
    return new Promise(
      (resolve, reject) => {
        this.db.database.ref('/orderNumber').once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  updateOrderNumber(number: Number) {
    this.db.database.ref('/orderNumber').set(number);
  }

}
