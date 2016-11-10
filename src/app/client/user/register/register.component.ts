import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../auth/user";

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnInit {
  myForm: FormGroup;
  email: FormControl;
  password: FormControl;

  constructor(private _fb: FormBuilder, private _authService: AuthService, private _router: Router, private toastr: ToastsManager) { }

  ngOnInit() {
    if (this._authService.isLoggedIn()) {
      this._router.navigateByUrl('/form')
    }
    this.email = new FormControl('', [Validators.required, this.isEmail]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(8)]);

    this.myForm = this._fb.group({
      email: this.email,
      password: this.password
    });
  }

  onSubmit() {
    const user = new User(this.myForm.value.email, this.myForm.value.password);
    this._authService.signup(user)
      .subscribe(
        data => {
          this._router.navigate(['/user/login']);
          this.toastr.success('Please Login', 'Registration Successfull')
        }
      )
  }

  private isEmail(control: FormControl): {[s: string]: boolean} {
    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
      return {invalidMail: true};
    }
  }
}
