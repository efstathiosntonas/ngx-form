import {Component} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Reset} from "../../auth/resetPassword";
import {ToastsManager} from "ng2-toastr";


@Component({
  selector: 'app-resetPassword',
  templateUrl: 'resetPassword.component.html',
  styleUrls: ['resetPagesStyle.css']
})

export class ResetPasswordComponent {

  myForm: FormGroup;
  password: FormControl;
  token: string;
  newPassword: string;

  constructor(private _fb: FormBuilder, private _authService: AuthService, private _router:Router, private _activatedRoute: ActivatedRoute , private toastr: ToastsManager) {
    this.token = _activatedRoute.snapshot.params['token']
  }

  ngOnInit() {

    this.password = new FormControl('', [Validators.required]);

    this.myForm = this._fb.group({
      password: this.password
    });

    if(this._authService.isLoggedIn()){
      this._router.navigate(['/'])
    }
  }

  onSubmit() {
    const password = new Reset(null, this.token, this.myForm.value.password);
    console.log(password);
    this._authService.reset(password)
      .subscribe(
        data =>  {
          this._router.navigate(['/user/login']);
          this.toastr.success('Your password has been changed succesfully');
        },
        error => console.log(error)
      )
  }
}

