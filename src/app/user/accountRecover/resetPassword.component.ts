import {Component, OnInit, Renderer, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Reset} from '../../auth/resetPassword';
import {ToastsManager} from 'ng2-toastr';


@Component({
  selector: 'app-reset-password',
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPagesStyle.css']
})

export class ResetPasswordComponent implements OnInit, AfterViewInit {

  myForm: FormGroup;
  password: FormControl;
  token: string;
  @ViewChild('newPassword') newPassword: ElementRef;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
              private activatedRoute: ActivatedRoute, private toastr: ToastsManager, private renderer: Renderer) {
    this.token = activatedRoute.snapshot.params['token'];
  }

  ngOnInit() {

    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);

    this.myForm = this.fb.group({
      password: this.password
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.newPassword.nativeElement, 'focus', []);
    }, 50);
  }

  onSubmit() {
    const password = new Reset(null, this.token, this.myForm.value.password);
    this.authService.reset(password)
      .subscribe(
        data => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Your password has been changed succesfully');
        },
        error => console.log(error)
      );
  }
}

