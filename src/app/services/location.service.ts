import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private db: AngularFireDatabase) { }

  getSingleLocation(id: string){
    return new Promise(
      (resolve, reject) => {
        this.db.database.ref('/locations/'+id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }


}
