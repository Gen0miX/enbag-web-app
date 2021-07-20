import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDismissReasons, NgbModal, NgbActiveModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  private routeSub: Subscription
  signInForm: FormGroup;
  resetPassForm: FormGroup;
  closeModalResult = '';
  errorMessage: string;
  errorMessageRP: string;
  submitted = false;
  resetPassSubmitted = false;
  location: boolean;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private modalService: NgbModal,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const location = params['location'];
      console.log(location);
      if(location != undefined){
        this.location = true;
      }else {
        this.location = false;
      }
    });

    this.initForm();
  }

  initForm(){
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
    this.resetPassForm = this.formBuilder.group({
      emailPassReset: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {return this.signInForm.controls;}
  get frp() {return this.resetPassForm.controls;}

  onSubmit(){
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;

   this.submitted = true;

    if(this.signInForm.invalid){
      return;
    }

    this.authService.signIn(email, password).then(
      () => {
        this.router.navigate(['/menu']);

      },
      (error) => {
        this.errorMessage = error ;
      }
    );
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
      (result) => {
        this.closeModalResult = `Closed with: ${result}`;
      }, (reason) => {
        this.errorMessageRP = null ;
        this.resetPassSubmitted = false;
        console.log(this.closeModalResult = `Dismissed ${this.getDismissReason(reason)}`);
      }
    );
  }

  private getDismissReason(reason: any): string {
    if(reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    }else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    }else {
      return `with: ${reason}`;
    }
  }

  onSubmitPassReset() {
    const email = this.resetPassForm.get('emailPassReset').value;
    this.resetPassSubmitted = true;

    if(this.resetPassForm.invalid){
      return;
    }

    this.authService.sendResetPasswordEmail(email).then(
      () => {
        this.modalService.dismissAll();
      }, (error) => {
      this.errorMessageRP = error;
      }
    );



}



}
