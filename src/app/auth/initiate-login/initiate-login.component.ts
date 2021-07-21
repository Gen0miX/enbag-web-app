import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import firebase from "firebase";

import {UsersService} from "../../services/users.service";
import {User} from "../../models/User.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-initiate-login',
  templateUrl: './initiate-login.component.html',
  styleUrls: ['./initiate-login.component.scss']
})
export class InitiateLoginComponent implements OnInit {

  constructor(private auth: AuthService,
              private userSrv: UsersService,
              private router: Router) {
  }

  user: User;

  ngOnInit(): void {
    this.userSrv.getUserByIdOnInit(this.auth.getCurrentUserID()).then(
      (user: User) => {
        this.user = user;
        if (user.role == '3') {
          this.router.navigate(['/menu']);
        }
        if (user.role == '2') {
          this.router.navigate(['/orders']);
        }
        if(user.role == '1'){
          this.router.navigate(['/orders']);
        }
      }
    );
  }

}
