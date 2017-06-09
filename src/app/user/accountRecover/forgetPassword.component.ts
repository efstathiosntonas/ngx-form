import {Component, OnInit, ViewChild, ElementRef, Renderer, AfterViewInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {Reset} from '../../auth/password.model';
import {ToastsManager} from 'ng2-toastr';

@Component({
  selector   : 'app-forget-password',
  templateUrl: './forgetPassword.component.html',
  styleUrls  : ['./resetPagesStyle.css']
})

export class ForgetPasswordComponent implements OnInit, AfterViewInit {
  myForm: FormGroup;
  email: FormControl;
  @ViewChild('userEmail') userEmail: ElementRef;

  constructor(private fb: FormBuilder, private authService: AuthService,
              private router: Router, private toastr: ToastsManager, private renderer: Renderer) {
  }

  ngOnInit() {
    this.email = new FormControl('', [Validators.required, this.emailValidator]);

    this.myForm = this.fb.group({
      email: this.email
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.userEmail.nativeElement, 'focus', []);
    }, 50);
  }

  onSubmit() {
    const email = new Reset(this.myForm.value.email, null, null);
    this.authService.forget(email)
      .subscribe(
        data => {
          this.router.navigate(['/']);
          this.toastr.success('An email has been sent with password reset instructions');
        },
        error => console.log(error)
      );

  }

  emailValidator(control) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }
}

