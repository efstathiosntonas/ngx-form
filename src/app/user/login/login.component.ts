import {Component, OnInit, ViewChild, ElementRef, Renderer, AfterViewInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {ToastsManager} from 'ng2-toastr';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {User} from '../../auth/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  myForm: FormGroup;
  email: FormControl;
  userId: string;
  password: FormControl;
  @ViewChild('userEmail') userEmail: ElementRef;

  constructor(private fb: FormBuilder, private authService: AuthService,
              private router: Router, private toastr: ToastsManager, private renderer: Renderer) {
  }

  ngOnInit() {
    this.email = new FormControl('', [Validators.required, this.emailValidator]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);

    this.myForm = this.fb.group({
      email: this.email,
      password: this.password
    });

    // check if the user is logged in while trying to access the login page, if the user is logged in, we redirect him to the form page
    if (this.authService.isLoggedIn()) {
      this.toastr.info('You are already logged in');
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.userEmail.nativeElement, 'focus', []);
    }, 50);
  }

  // submit the login form with the user credentials and navigate the user to the index page of our app
  onSubmit() {
    const user = new User(this.myForm.value.email, this.myForm.value.password);
    this.authService.signin(user)
      .subscribe(
        data => {
          console.log(data.user)
          // if the user credentials are correct, set the localStorage token and userId,
          // we need these info in order to do stuff later when the user is signed in and verified
          localStorage.setItem('id_token', data.token);
          localStorage.setItem('userId', data.user._id);
          localStorage.setItem('email', data.user.email);
          localStorage.setItem('role', data.user.role[0]);
          // navigate user to index page of our app
          this.router.navigate(['/']);
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
