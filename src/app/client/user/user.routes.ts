import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ResetPasswordComponent} from './accountRecover/resetPassword.component';
import {ForgetPasswordComponent} from './accountRecover/forgetPassword.component';
import {UserFormComponent} from '../userForms/formsTable/userForms.component';
import {AuthGuardService} from '../auth/authguard.service';
import {EditUserFormComponent} from '../userForms/editForm/editUserForm.component';
import {AppComponent} from '../../app.component';

export const USER_ROUTES: Routes = [
  {path: '', component: AppComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'reset', component: ForgetPasswordComponent},
  {path: 'reset/:token', component: ResetPasswordComponent},
  {path: 'forms', component: UserFormComponent, canActivate: [AuthGuardService]},
  {path: 'forms/edit/:id', component: EditUserFormComponent, canActivate: [AuthGuardService]}
];
