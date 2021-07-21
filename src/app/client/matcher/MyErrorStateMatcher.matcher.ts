import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";

export class MyErrorStateMatcher implements ErrorStateMatcher {

  isSubmitted: boolean

  constructor(isSubmitted:boolean) {
    this.isSubmitted = isSubmitted;
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = this.isSubmitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  setIsSubmitted (isSubmitted:boolean){
    this.isSubmitted = isSubmitted;
  }
}
