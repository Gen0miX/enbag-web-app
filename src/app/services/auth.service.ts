import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireDatabase} from "@angular/fire/database";
import {User} from "../models/User.model";
import firebase from "firebase";
import {first, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth = false;
  user: firebase.User;
  userId: string;

  constructor(private auth: AngularFireAuth,
              private db: AngularFireDatabase) { }

  signIn(email: string, password: string){
    return new Promise<void>(
      (resolve, reject) => {
        this.auth.signInWithEmailAndPassword(email, password).then(
          () => {
            this.isAuth = true;
            this.getCurrentUser();
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewUser(user: User, password) {
    return new Promise<void>(
      (resolve, reject) => {
        this.auth.createUserWithEmailAndPassword(user.email, password).then (
          (cred) => {
            cred.user.sendEmailVerification().then();
            this.db.database.ref('users/'+cred.user.uid).set({
              id: cred.user.uid,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              isVerified: false,
              address: user.address,
              postCode: user.postCode,
              city: user.city,
              phoneNumber: user.phoneNumber,
              location: user.location,
              role: user.role
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
    this.isAuth = false;
    this.user = null ;
    this.auth.signOut();
  }

  isUserAuth(): boolean {
    return this.isAuth;
  }

  sendResetPasswordEmail(email: string) {
    return new Promise<void> (
      (resolve, reject) => {
        this.auth.sendPasswordResetEmail(email).then(
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

  isLoggedIn(){
    return this.auth.authState.pipe(first()).toPromise();
  }

  async getCurrentUser() {
    const user = await this.isLoggedIn();
      if(user){
        this.user = user;
      }else {
        console.log('User not logged in');
      }
  }

/*  getCurrentUserIDOnInit(): string {
   this.auth.authState.subscribe(user => {
     if(user) {return user.uid}
     return ('NULL');
   });
   return ('NULL')
  }*/

  getCurrentUserID(): string {
    return this.userId;
  }

  onAuthStateChanged() {
    this.auth.onAuthStateChanged((user) => {
      if(user) {
        console.log('connected');
        this.isAuth = true;
        this.user = user;
        this.userId = user.uid;
      } else {
        console.log('disconnected');
        this.isAuth = false;
        this.user = null;
        this.userId = '';
      }
    });
  }

}
