import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, RequestOptions, Http} from '@angular/http';
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
import {CompanieComponent} from './companie/companie.component';
import {MapComponent} from './map/map.component';
import {ResetPasswordComponent} from './user/accountRecover/resetPassword.component';
import {ForgetPasswordComponent} from './user/accountRecover/forgetPassword.component';
import {FormService} from './form/form.service';
import {CompanieService} from './companie/companie.service';
import {RegionService} from './region/region.service';

import {EditUserFormComponent} from './userForms/editForm/editUserForm.component';
import {ProgressBarModule} from 'ng2-progress-bar';
import {ErrorPageComponent} from './errorPage/errorPage.component';

import {AdminPageComponent} from './admin/adminPage/adminPage.component';
import {AdminService} from './admin/services/admin.service';
import {EditUsersFormsComponent} from './admin/editUsersForms/editUsersForms.component';

import {EditOptionsComponent} from './admin/editOptions/editOptions.component';
import {EditOptionsComponentDialog} from './admin/editOptions/editOptions.component';

import {EditOptionsService} from './admin/editOptions/editOptions.service';



import {AdminGuardService} from './admin/services/adminGuard';
import {AdminComponent} from './admin/admin.component';

import { UserProfileComponent } from './user/profile/userProfile.component';
import {ProfileService} from "./user/profile/profile.service";
import { ChangePasswordComponent } from './user/profile/changePassword/changePassword.component';
import { MaterialModule } from '@angular/material';
import {Ng2PaginationModule} from 'ng2-pagination';


import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbdModalContent } from './companie/companie.component';



import {UserFormsComponent} from './userForms/formsTable/userForms.component';

import {AuthHttp, AuthConfig} from 'angular2-jwt';



import {  ApplicationRef } from '@angular/core';
import { AgmCoreModule } from 'angular2-google-maps/core';

let options = <ToastOptions> {
  animate: 'flyRight',
  positionClass: 'toast-top-right',
};

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp( new AuthConfig({}), http, options);
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
    CompanieComponent,
    MapComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
    UserFormsComponent,
    EditUserFormComponent,
    ErrorPageComponent,
    AdminPageComponent,
    EditUsersFormsComponent,
    EditOptionsComponent,
    EditOptionsComponentDialog,
    AdminComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    NgbdModalContent,

  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    routing,
    ToastModule.forRoot(options),
    ProgressBarModule,
    BrowserModule,
    FormsModule,
    Ng2PaginationModule,
    NgbModule.forRoot(),
    MaterialModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: ''
    })
  ],
  providers: [
    AuthGuardService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthService,
    ErrorService,
    CompanieService,
    RegionService,
    FormService,
    AdminService,
    EditOptionsService,
    AdminGuardService,
    ProfileService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [ Http, RequestOptions ]
    }
  ],
  entryComponents: [NgbdModalContent, EditOptionsComponentDialog],
  bootstrap: [AppComponent, EditOptionsComponentDialog]
})
export class AppModule {
}
