import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {User} from "../models/User.model";
import {UsersService} from "../services/users.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User;

  constructor(private auth: AuthService, private userSrv: UsersService) { }

  ngOnInit(): void {
    this.userSrv.getUserByIdOnInit(this.auth.getCurrentUserID()).then(
      (user: User) => {
        this.user = user;
      }
    )
  }

  onSignOut(){
    this.auth.signOutUser();
  }

}
