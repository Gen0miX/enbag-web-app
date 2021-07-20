import {Component, OnInit, HostListener, Input} from '@angular/core';
import {AuthService} from "../../../services/auth.service";


@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit{

    stripeCheckout:any = null;

    ngOnInit(){
      this.stripePaymentGateway();
    }

    checkout(amount){
      const stripeCheckout = (<any>window).StripeCheckout.configure({
        key: 'pk_test_51JEzSbGhdWutQrVkv2Wwx0lROxQXBEyhRHZanS5W0I60mOaTIw6dtSYsRwsv8jDWWn7XmmPuRwsthXgYbDLaRvPv00nkx5mbLb',
        locale:'auto',
        token: function(stripeToken:any){
          console.log(stripeToken);
          alert('Stripe token generated');
        }
      });

      stripeCheckout.open({
        name:'EnBAG',
        description: 'Pay your WallBox',
        amount: amount * 100
      })

    }

    stripePaymentGateway() {
      if(!window.document.getElementById('stripe-script')) {
        const scr = window.document.createElement("script");
        scr.id = "stripe-script";
        scr.type = "text/javascript";
        scr.src = "https://checkout.stripe.com/checkout.js";

        scr.onload = () => {
          this.stripeCheckout = (<any>window).StripeCheckout.configure({
            key: 'pk_test_51JEzSbGhdWutQrVkv2Wwx0lROxQXBEyhRHZanS5W0I60mOaTIw6dtSYsRwsv8jDWWn7XmmPuRwsthXgYbDLaRvPv00nkx5mbLb',
            locale: 'auto',
            token: function (token: any) {
              console.log(token)
              alert('Payment via stripe successfull!');
            }
          });
        }

        window.document.body.appendChild(scr);
      }
    }
}
