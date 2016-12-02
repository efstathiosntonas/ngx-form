import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {NavbarComponent} from './client/navbar/navbar.component';
import {FormComponent} from './client/form/form.component';
import {RegisterComponent} from './client/user/register/register.component';
import {UserComponent} from './client/user/user.component';
import {RouterModule} from '@angular/router';
import {routing} from './client/routes.component';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AuthGuardService} from './client/auth/authguard.service';
import {AuthService} from './client/auth/auth.service';
import {ErrorService} from './client/errorHandler/error.service';
import {ToastModule, ToastOptions} from 'ng2-toastr';
import {LoginComponent} from './client/user/login/login.component';
import {ErrorComponent} from './client/errorHandler/error.component';
import {MainPageComponent} from './client/mainPage/mainPage.component';
import {ResetPasswordComponent} from './client/user/accountRecover/resetPassword.component';
import {ForgetPasswordComponent} from './client/user/accountRecover/forgetPassword.component';
import {FormService} from './client/form/form.service';
import {UserFormComponent} from './client/userForms/formsTable/userForms.component';
import {EditUserFormComponent} from './client/userForms/editForm/editUserForm.component';
import {ProgressBarModule} from 'ng2-progress-bar';
import {ErrorPageComponent} from './client/errorPage/errorPage.component';
import {AdminPageComponent} from './client/admin/adminPage/adminPage.component';
import {AdminService} from './client/admin/services/admin.service';
import {EditUsersFormsComponent} from './client/admin/editUsersForms/editUsersForms.component';
import {AdminGuardService} from './client/admin/services/adminGuard';
import {AdminComponent} from './client/admin/admin.component';


let options = <ToastOptions> {
  animate: 'flyRight',
  positionClass: 'toast-top-right',
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FormComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent,
    NavbarComponent,
    ErrorComponent,
    MainPageComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
    UserFormComponent,
    EditUserFormComponent,
    ErrorPageComponent,
    AdminPageComponent,
    EditUsersFormsComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    routing,
    ToastModule.forRoot(options),
    ProgressBarModule
  ],
  providers: [
    AuthGuardService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthService,
    ErrorService,
    FormService,
    AdminService,
    AdminGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
