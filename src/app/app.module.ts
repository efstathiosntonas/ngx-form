import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {FormComponent} from './form/form.component';
import {RegisterComponent} from './user/register/register.component';
import {UserComponent} from './user/user.component';
import {RouterModule} from '@angular/router';
import {routing} from './routes.component';
import {CommonModule, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AuthGuardService} from './auth/authguard.service';
import {AuthService} from './auth/auth.service';
import {ErrorService} from './errorHandler/error.service';
import {ToastModule, ToastOptions} from 'ng2-toastr';
import {LoginComponent} from './user/login/login.component';
import {ErrorComponent} from './errorHandler/error.component';
import {MainPageComponent} from './mainPage/mainPage.component';
import {ResetPasswordComponent} from './user/accountRecover/resetPassword.component';
import {ForgetPasswordComponent} from './user/accountRecover/forgetPassword.component';
import {FormService} from './form/form.service';
import {UserFormsComponent} from './userForms/formsTable/userForms.component';
import {EditUserFormComponent} from './userForms/editForm/editUserForm.component';
import {ErrorPageComponent} from './errorPage/errorPage.component';
import {AdminPageComponent} from './admin/adminPage/adminPage.component';
import {AdminService} from './admin/services/admin.service';
import {EditUsersFormsComponent} from './admin/editUsersForms/editUsersForms.component';
import {AdminGuardService} from './admin/services/adminGuard';
import {AdminComponent} from './admin/admin.component';
import {UserProfileComponent} from './user/profile/userProfile.component';
import {ProfileService} from './user/profile/profile.service';
import {ChangePasswordComponent} from './user/profile/changePassword/changePassword.component';
import {AuthConfig, AuthHttp} from 'angular2-jwt';
import {ProgressBarModule} from 'ngx-progress-bar';
import {CustomOption} from './config/toastr.config';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';


export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError   : true,
    headerPrefix : 'JWT',
    globalHeaders: [{'Content': 'application/json'}],
  }), http);
}

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
    UserFormsComponent,
    EditUserFormComponent,
    ErrorPageComponent,
    AdminPageComponent,
    EditUsersFormsComponent,
    AdminComponent,
    UserProfileComponent,
    ChangePasswordComponent
  ],
  imports     : [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    routing,
    ProgressBarModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    Ng2Bs3ModalModule
  ],
  providers   : [
    AuthGuardService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthService,
    ErrorService,
    FormService,
    AdminService,
    AdminGuardService,
    ProfileService,
    {provide: ToastOptions, useClass: CustomOption},
    {
      provide   : AuthHttp,
      useFactory: getAuthHttp,
      deps      : [Http]
    },
  ],
  bootstrap   : [AppComponent]
})
export class AppModule {
}
