import {Routes} from '@angular/router'
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ResetPasswordComponent} from "./accountRecover/resetPassword.component";
import {ForgetPasswordComponent} from "./accountRecover/forgetPassword.component";

export const USER_ROUTES: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'reset', component: ForgetPasswordComponent },
  { path: 'reset/:token', component: ResetPasswordComponent }
];
