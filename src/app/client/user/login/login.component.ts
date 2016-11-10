import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../auth/user";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  email: FormControl;
  userId: string;
  password: FormControl;

  constructor(private _fb: FormBuilder, private _authService: AuthService, private _router: Router, private toastr: ToastsManager) { }

  ngOnInit() {
    this.email = new FormControl('', [Validators.required, this.isEmail]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);

    this.myForm = this._fb.group({
      email: this.email,
      password: this.password
    });

    if (this._authService.isLoggedIn()) {
      this._router.navigate(['/form'])
    }
  }

  onSubmit() {
    const user = new User(this.myForm.value.email, this.myForm.value.password);
    this._authService.signin(user)
      .subscribe(
        data => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          this._router.navigate(['/']);
          this.toastr.success('You have been logged in!');
        },
        error => console.log(error)
      )

  }

  private isEmail(control: FormControl): {[s: string]: boolean} {
    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
      return {invalidMail: true};
    }
  }
}
