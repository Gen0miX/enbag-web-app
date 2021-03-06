import {Injectable} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {User} from "../models/User.model";
import {Subject} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: User[] = [];
  user: User;
  installateurs: User [] = [];
  usersSubject = new Subject<User[]>();

  constructor(private db: AngularFireDatabase,
              private auth: AuthService) { }

  emitUsers(){
    this.usersSubject.next(this.users);
  }

  getInstallateurs() {
  var ref = this.db.database.ref('/users');
  ref.orderByChild('role').equalTo(2).on('value', (data) => {
    let result = [];
    data.forEach(child => {
      result.push(child.val());
    });
    this.users = result ? result: [];
    this.emitUsers();
  });
 }

 getUserById(id: string): User {
    this.db.database.ref('/users/'+id).once('value', (data) => {
      this.user = data.val();
    });
  return this.user;
 }

 getUserByIdOnInit(id: string) {
   return new Promise(
     (resolve, reject) => {
       this.db.database.ref('/users/'+id).once('value').then(
         (data) => {
           resolve(data.val());
         }, (error) => {
           reject(error);
         }
       )
     }
   );
 }

 getCurrentUserLocation(): string{
   let id = this.auth.getCurrentUserID();
   let user = this.getUserById(id);
   return user.location;
 }
}
