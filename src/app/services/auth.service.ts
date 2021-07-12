import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireDatabase} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth,
              private db: AngularFireDatabase) { }

  signIn(email: string, password: string){
    return new Promise<void>(
      (resolve, reject) => {
        this.auth.signInWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewUser(firstName: string, lastName: string, email: string, password: string,
                address: string, postCode: number, city: string, phoneNumber: number) {
    return new Promise<void>(
      (resolve, reject) => {
        this.auth.createUserWithEmailAndPassword(email, password).then (
          (cred) => {
            this.db.database.ref('users/'+cred.user.uid).set({
              firstName: firstName,
              lastName: lastName,
              email: email,
              address: address,
              postCode: postCode,
              city: city,
              phoneNumber: phoneNumber
            });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signOutUser() {
    this.auth.signOut();
  }

}
