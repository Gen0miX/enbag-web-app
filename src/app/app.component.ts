import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AuthService} from "./services/auth.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private auth: AuthService) {

  }

  ngOnInit() {
    this.auth.onAuthStateChanged();
  }

  isAuth(): boolean {
    return this.auth.isUserAuth();
  }



}
