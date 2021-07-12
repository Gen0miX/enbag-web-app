import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  errorMessage: string;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {return this.signUpForm.controls;}

  initForm(){
    this.signUpForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName:['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      passwordConf: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    }, {validator: this.MustMatch('password', 'passwordConf')});
  }

  onSubmit(){
    const lastName = this.signUpForm.get('lastName').value;
    const firstName = this.signUpForm.get('firstName').value;
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const address = this.signUpForm.get('address').value;
    const city = this.signUpForm.get('city').value;
    const postCode = this.signUpForm.get('postCode').value;
    const phoneNumber = this.signUpForm.get('phoneNumber').value;

    this.submitted = true;

    if(this.signUpForm.invalid){
      return;
    }

    this.authService.createNewUser(firstName,lastName,email,password,address,postCode,city,phoneNumber).then(
      () => {
        this.router.navigate(['/menu']);
      },
      (error) => {
        this.errorMessage = error ;
      }
    );
  }

MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }


}