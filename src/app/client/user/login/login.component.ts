import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {User} from '../../auth/user.model';

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

  constructor(private _fb: FormBuilder, private _authService: AuthService, private _router: Router, private toastr: ToastsManager) {
  }

  ngOnInit() {
    this.email = new FormControl('', [Validators.required, this.emailValidator]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);

    this.myForm = this._fb.group({
      email: this.email,
      password: this.password
    });

    // check if the user is logged in while trying to access the login page, if the user is logged in, we redirect him to the form page
    if (this._authService.isLoggedIn()) {
      this._router.navigate(['/form']);
    }
  }

  // submit the login form with the user credentials and navigate the user to the index page of our app
  onSubmit() {
    const user = new User(this.myForm.value.email, this.myForm.value.password);
    this._authService.signin(user)
      .subscribe(
        data => {
          // if the user credentials are correct, set the localStorage token and userId,
          // we need these info in order to do stuff later when the user is signed in and verified
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.userId);
          // navigate user to index page of our app
          this._router.navigate(['/']);
          // display toastr success message pop up to inform the user that he logged in successfully
          this.toastr.success('You have been logged in!');
        },
        error => console.log(error)
      );

  }


  // input validator to check if the email entered by the user is actually text in an email form
  emailValidator(control) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }
}
