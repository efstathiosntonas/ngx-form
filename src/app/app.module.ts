import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {NavbarComponent} from './client/navbar/navbar.component';
import {FormComponent} from './client/form/form.component';
import {RegisterComponent} from './client/user/register/register.component';
import {UserComponent} from "./client/user/user.component";
import {RouterModule} from "@angular/router";
import {routing} from "./client/routes.component";
import {CommonModule, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {AuthGuardService} from "./client/auth/authguard.service";
import {AuthService} from "./client/auth/auth.service";
import {ErrorService} from "./errorHandler/error.service";
import {ToastModule, ToastOptions} from "ng2-toastr";
import {LoginComponent} from "./client/user/login/login.component";
import {ErrorComponent} from "./errorHandler/error.component";
import {MainPageComponent} from "./client/mainPage/mainPage.component";

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
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    routing,
    ToastModule.forRoot(options)
  ],
  providers: [
    AuthGuardService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthService,
    ErrorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
